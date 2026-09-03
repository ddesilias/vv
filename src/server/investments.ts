import 'server-only'

import { neon } from '@neondatabase/serverless'
import { promises as fs } from 'fs'
import path from 'path'

export type PaymentStatus =
  | 'not_created'
  | 'pending'
  | 'successful'
  | 'failed'
  | 'cancelled'

export type PaymentMode = 'live' | 'demo'

export type InvestmentEvent = {
  at: string
  type: string
  message: string
  metadata?: Record<string, unknown>
}

export type InvestorDetails = {
  fullName: string
  birthDate: string
  identityDocument: string
  address: string
  phone: string
  email: string
  contractNumber: string
}

export type Investment = {
  id: string
  referenceId: string
  createdAt: string
  updatedAt: string
  signedAt: string
  sourcePdf: {
    fileName: string
    sha256: string
  }
  investor: InvestorDetails
  projectName: string
  amountGdes: number
  signatureDataUrl: string
  consentAccepted: boolean
  legal: {
    ipAddress: string
    userAgent: string
    acceptanceText: string
  }
  payment: {
    provider: 'bazik-moncash'
    mode: PaymentMode
    status: PaymentStatus
    orderId?: string
    redirectUrl?: string
    verifiedAt?: string
    raw?: unknown
  }
  events: InvestmentEvent[]
}

type InvestmentStore = {
  investments: Investment[]
}

const DATA_DIR = path.join(process.cwd(), 'data')
const STORE_PATH = path.join(DATA_DIR, 'investments.json')
const databaseUrl = process.env.DATABASE_URL
const sql = databaseUrl ? neon(databaseUrl) : null
let databaseReady: Promise<void> | null = null

export const SOURCE_PDF = {
  fileName: 'Consentement_Investissement_VV_Society.pdf',
  sha256: '49654b7b442608c100a30a7646946e02947d7dbee0e2968e547d7b21736f787c'
}

export const ACCEPTANCE_TEXT =
  "J'ai lu et j'accepte les conditions d'investissement de V&V Society."

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true })

  try {
    await fs.access(STORE_PATH)
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify({ investments: [] }, null, 2))
  }
}

async function readStore(): Promise<InvestmentStore> {
  await ensureStore()
  const content = await fs.readFile(STORE_PATH, 'utf8')
  return JSON.parse(content) as InvestmentStore
}

async function writeStore(store: InvestmentStore) {
  await ensureStore()
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2))
}

async function ensureDatabase() {
  if (!sql) {
    throw new Error(
      'DATABASE_URL is required in deployed environments to store investments.'
    )
  }

  if (!databaseReady) {
    databaseReady = sql`
      CREATE TABLE IF NOT EXISTS investments (
        id TEXT PRIMARY KEY,
        reference_id TEXT NOT NULL UNIQUE,
        order_id TEXT,
        payload JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.then(() => undefined)
  }

  await databaseReady
}

async function insertDatabaseInvestment(investment: Investment) {
  await ensureDatabase()
  await sql!`
    INSERT INTO investments (id, reference_id, order_id, payload, created_at, updated_at)
    VALUES (
      ${investment.id},
      ${investment.referenceId},
      ${investment.payment.orderId || null},
      ${JSON.stringify(investment)}::jsonb,
      ${investment.createdAt},
      ${investment.updatedAt}
    )
  `
}

async function getDatabaseInvestment(id: string) {
  await ensureDatabase()
  const rows = await sql!`
    SELECT payload FROM investments WHERE id = ${id} LIMIT 1
  `

  return (rows[0]?.payload as Investment | undefined) || null
}

async function updateDatabaseInvestment(investment: Investment) {
  await ensureDatabase()
  await sql!`
    UPDATE investments
    SET reference_id = ${investment.referenceId},
        order_id = ${investment.payment.orderId || null},
        payload = ${JSON.stringify(investment)}::jsonb,
        updated_at = ${investment.updatedAt}
    WHERE id = ${investment.id}
  `
}

async function findDatabaseInvestmentByField(
  field: 'order_id' | 'reference_id',
  value: string
) {
  await ensureDatabase()
  const rows =
    field === 'order_id'
      ? await sql!`
          SELECT payload FROM investments WHERE order_id = ${value} LIMIT 1
        `
      : await sql!`
          SELECT payload FROM investments WHERE reference_id = ${value} LIMIT 1
        `

  return (rows[0]?.payload as Investment | undefined) || null
}

export function createInvestmentEvent(
  type: string,
  message: string,
  metadata?: Record<string, unknown>
): InvestmentEvent {
  return {
    at: new Date().toISOString(),
    type,
    message,
    metadata
  }
}

export async function createInvestment(
  input: Omit<Investment, 'id' | 'createdAt' | 'updatedAt' | 'events'>
) {
  const now = new Date().toISOString()
  const investment: Investment = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    events: [
      createInvestmentEvent('signature.created', 'Investment consent signed.')
    ]
  }

  if (sql) {
    await insertDatabaseInvestment(investment)
  } else {
    const store = await readStore()
    store.investments.unshift(investment)
    await writeStore(store)
  }

  return investment
}

export async function getInvestment(id: string) {
  if (sql) {
    return getDatabaseInvestment(id)
  }

  const store = await readStore()
  return store.investments.find(investment => investment.id === id) || null
}

export async function findInvestmentByOrderId(orderId: string) {
  if (sql) {
    return findDatabaseInvestmentByField('order_id', orderId)
  }

  const store = await readStore()

  return (
    store.investments.find(
      investment => investment.payment.orderId === orderId
    ) || null
  )
}

export async function findInvestmentByReferenceId(referenceId: string) {
  if (sql) {
    return findDatabaseInvestmentByField('reference_id', referenceId)
  }

  const store = await readStore()

  return (
    store.investments.find(
      investment => investment.referenceId === referenceId
    ) || null
  )
}

export async function updateInvestment(
  id: string,
  updater: (investment: Investment) => Investment
) {
  if (sql) {
    const investment = await getDatabaseInvestment(id)

    if (!investment) {
      return null
    }

    const updated = updater({
      ...investment,
      updatedAt: new Date().toISOString()
    })

    await updateDatabaseInvestment(updated)
    return updated
  }

  const store = await readStore()
  const index = store.investments.findIndex(investment => investment.id === id)

  if (index === -1) {
    return null
  }

  const updated = updater({
    ...store.investments[index],
    updatedAt: new Date().toISOString()
  })

  store.investments[index] = updated
  await writeStore(store)

  return updated
}

function readStatusText(status: unknown): string | null {
  if (typeof status === 'string') {
    return status
  }

  if (typeof status !== 'object' || status === null) {
    return null
  }

  const record = status as Record<string, unknown>

  for (const key of ['status', 'paymentStatus', 'type']) {
    const value = record[key]

    if (typeof value === 'string') {
      return value
    }
  }

  for (const key of ['data', 'payment']) {
    const nested = readStatusText(record[key])

    if (nested) {
      return nested
    }
  }

  return null
}

export function normalizePaymentStatus(status: unknown): PaymentStatus {
  const statusText = readStatusText(status)

  if (!statusText) {
    return 'pending'
  }

  const normalized = statusText.toLowerCase()

  if (
    normalized.includes('success') ||
    normalized.includes('succeed') ||
    normalized.includes('complete') ||
    normalized.includes('paid')
  ) {
    return 'successful'
  }

  if (normalized.includes('cancel')) {
    return 'cancelled'
  }

  if (normalized.includes('fail') || normalized.includes('error')) {
    return 'failed'
  }

  return 'pending'
}

export function hasProcessedWebhookEvent(
  investment: Investment,
  identifiers: { eventId?: string; transactionId?: string }
) {
  return investment.events.some(event => {
    const eventId = event.metadata?.eventId
    const transactionId = event.metadata?.transactionId

    return (
      (identifiers.eventId && eventId === identifiers.eventId) ||
      (identifiers.transactionId && transactionId === identifiers.transactionId)
    )
  })
}
