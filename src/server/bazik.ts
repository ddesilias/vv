import 'server-only'

import crypto from 'crypto'

type BazikTokenResponse = {
  access_token?: string
  token?: string
  token_type?: string
  expires_in?: number
  expires_at?: number
  user_id?: string
  [key: string]: unknown
}

type BazikPaymentPayload = {
  gdes: number
  userID: string
  referenceId: string
  description: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  webhookUrl: string
  successUrl: string
  errorUrl: string
  metadata?: Record<string, unknown>
}

export type BazikPaymentResponse = {
  success?: boolean
  data?: Record<string, unknown>
  orderId?: string
  order_id?: string
  redirectUrl?: string
  redirect_url?: string
  status?: string
  [key: string]: unknown
}

export type BazikVerificationResponse = {
  status?: string
  referenceId?: string
  orderId?: string
  data?: Record<string, unknown>
  payment?: Record<string, unknown>
  [key: string]: unknown
}

export type NormalizedBazikPayment = {
  orderId?: string
  redirectUrl?: string
  status?: string
  receiver?: string
  raw: BazikPaymentResponse
}

class BazikApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'BazikApiError'
    this.status = status
    this.body = body
  }
}

let cachedToken: string | null = null
let cachedTokenExpiresAt = 0

const TOKEN_REFRESH_MARGIN_MS = 60_000
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504])
const MAX_ATTEMPTS = 3

function getBaseUrl() {
  return (
    process.env.BAZIK_API_URL ||
    process.env.BAZIK_BASE_URL ||
    'https://api.bazik.io'
  ).replace(/\/+$/, '')
}

export function hasBazikCredentials() {
  return Boolean(process.env.BAZIK_USER_ID && process.env.BAZIK_SECRET_KEY)
}

export function hasBazikWebhookSecret() {
  return Boolean(process.env.BAZIK_WEBHOOK_SECRET)
}

function getBazikCredentials() {
  const userID = process.env.BAZIK_USER_ID
  const secretKey = process.env.BAZIK_SECRET_KEY

  if (!userID || !secretKey) {
    throw new BazikApiError('Bazik credentials are not configured.', 500, null)
  }

  return { userID, secretKey }
}

function usesSandboxCredentials() {
  const { userID, secretKey } = getBazikCredentials()
  return /sandbox/i.test(userID) || /sandbox/i.test(secretKey)
}

export function getBazikUserId() {
  return getBazikCredentials().userID
}

async function readJsonResponse(response: Response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getErrorMessage(body: unknown, status: number) {
  const fallback = `Bazik request failed with status ${status}`

  if (
    typeof body === 'object' &&
    body !== null &&
    'message' in body &&
    typeof body.message === 'string'
  ) {
    return body.message
  }

  if (
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    typeof body.error === 'string'
  ) {
    return body.error
  }

  return fallback
}

async function fetchJson<T>(url: string, init: RequestInit): Promise<T> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let response: Response

    try {
      response = await fetch(url, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init.headers || {})
        },
        cache: 'no-store'
      })
    } catch (error) {
      if (attempt < MAX_ATTEMPTS) {
        await sleep(200 * 2 ** (attempt - 1))
        continue
      }

      throw new BazikApiError(
        'Bazik request failed before receiving a response.',
        502,
        error instanceof Error ? { message: error.message } : error
      )
    }

    const body = await readJsonResponse(response)

    if (response.ok) {
      return body as T
    }

    if (attempt < MAX_ATTEMPTS && RETRYABLE_STATUS_CODES.has(response.status)) {
      await sleep(200 * 2 ** (attempt - 1))
      continue
    }

    throw new BazikApiError(
      getErrorMessage(body, response.status),
      response.status,
      body
    )
  }

  throw new BazikApiError('Bazik request failed.', 502, null)
}

async function authenticate() {
  const { userID, secretKey } = getBazikCredentials()

  const data = await fetchJson<BazikTokenResponse>(`${getBaseUrl()}/token`, {
    method: 'POST',
    body: JSON.stringify({ userID, secretKey })
  })

  const token = data.access_token || data.token

  if (!token) {
    throw new BazikApiError('Bazik did not return an access token.', 502, data)
  }

  cachedToken = token

  if (typeof data.expires_in === 'number' && data.expires_in > 0) {
    cachedTokenExpiresAt = Date.now() + data.expires_in * 1000
  } else if (typeof data.expires_at === 'number' && data.expires_at > 0) {
    cachedTokenExpiresAt =
      data.expires_at > 10_000_000_000
        ? data.expires_at
        : data.expires_at * 1000
  } else {
    cachedTokenExpiresAt = Date.now() + 55 * 60_000
  }

  return cachedToken
}

async function getToken() {
  if (
    !cachedToken ||
    Date.now() > cachedTokenExpiresAt - TOKEN_REFRESH_MARGIN_MS
  ) {
    return authenticate()
  }

  return cachedToken
}

async function bazikRequest<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown
) {
  const token = await getToken()

  return fetchJson<T>(`${getBaseUrl()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  })
}

export async function createMoncashPayment(payload: BazikPaymentPayload) {
  return bazikRequest<BazikPaymentResponse>('POST', '/moncash/token', payload)
}

export async function verifyMoncashPayment(orderId: string) {
  return bazikRequest<BazikVerificationResponse>(
    'GET',
    `/order/${encodeURIComponent(orderId)}`
  )
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : {}
}

function pickString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key]

    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  return undefined
}

function normalizeMoncashRedirectUrl(url: string | undefined) {
  if (!url || !usesSandboxCredentials()) {
    return url
  }

  try {
    const redirect = new URL(url)

    if (redirect.hostname === 'moncashbutton.digicelgroup.com') {
      redirect.hostname = 'sandbox.moncashbutton.digicelgroup.com'
      return redirect.toString()
    }
  } catch {
    return url
  }

  return url
}

export function normalizeBazikPaymentResponse(
  payment: BazikPaymentResponse
): NormalizedBazikPayment {
  const data = asRecord(payment.data)
  const records = [data, payment]

  return {
    orderId:
      pickString(records[0], ['orderId', 'order_id']) ||
      pickString(records[1], ['orderId', 'order_id']),
    redirectUrl: normalizeMoncashRedirectUrl(
      pickString(records[0], ['redirectUrl', 'redirect_url']) ||
        pickString(records[1], ['redirectUrl', 'redirect_url'])
    ),
    status:
      pickString(records[0], ['status']) || pickString(records[1], ['status']),
    receiver:
      pickString(records[0], ['receiver']) ||
      pickString(records[1], ['receiver']),
    raw: payment
  }
}

function timingSafeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

export function verifyBazikWebhookSignature({
  rawBody,
  timestamp,
  eventId,
  signature
}: {
  rawBody: string
  timestamp: string | null
  eventId: string | null
  signature: string | null
}) {
  const webhookSecret = process.env.BAZIK_WEBHOOK_SECRET

  if (!webhookSecret || !timestamp || !eventId || !signature) {
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(`${timestamp}.${eventId}.${rawBody}`)
    .digest('hex')

  const received = signature.trim()

  return [expectedSignature, `v1=${expectedSignature}`].some(candidate =>
    timingSafeCompare(received, candidate)
  )
}

export function describeBazikError(error: unknown) {
  if (error instanceof BazikApiError) {
    return {
      message: error.message,
      status: error.status,
      body: error.body
    }
  }

  if (error instanceof Error) {
    return { message: error.message, status: 500, body: null }
  }

  return { message: 'Unknown Bazik error.', status: 500, body: null }
}
