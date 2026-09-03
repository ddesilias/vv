import { NextResponse } from 'next/server'
import {
  ACCEPTANCE_TEXT,
  SOURCE_PDF,
  createInvestment,
  createInvestmentEvent,
  updateInvestment
} from '@/src/server/investments'
import {
  createMoncashPayment,
  describeBazikError,
  getBazikUserId,
  hasBazikCredentials,
  normalizeBazikPaymentResponse
} from '@/src/server/bazik'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type StartInvestmentBody = {
  locale?: string
  fullName?: string
  birthDate?: string
  identityDocument?: string
  address?: string
  phone?: string
  email?: string
  contractNumber?: string
  projectName?: string
  amountGdes?: number
  signatureDataUrl?: string
  consentAccepted?: boolean
}

const SUPPORTED_LOCALES = new Set([
  'fr',
  'en',
  'ja',
  'de',
  'ru',
  'es',
  'fa',
  'ar'
])
const MAX_MONCASH_TRANSACTION_GDES = 75_000
const MAX_SIGNATURE_DATA_URL_LENGTH = 1_000_000

function value(body: StartInvestmentBody, key: keyof StartInvestmentBody) {
  const current = body[key]
  return typeof current === 'string' ? current.trim() : ''
}

function getClientIp(request: Request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function getAppOrigin(request: Request) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    new URL(request.url).origin
  ).replace(/\/+$/, '')
}

function getNames(fullName: string) {
  const [firstName, ...rest] = fullName.split(/\s+/)
  return {
    firstName,
    lastName: rest.join(' ') || '-'
  }
}

function validateBody(body: StartInvestmentBody) {
  const requiredFields: Array<keyof StartInvestmentBody> = [
    'fullName',
    'birthDate',
    'identityDocument',
    'address',
    'phone',
    'email',
    'contractNumber',
    'projectName',
    'signatureDataUrl'
  ]

  for (const field of requiredFields) {
    if (!value(body, field)) {
      return `${field} is required.`
    }
  }

  if (!body.consentAccepted) {
    return 'Investment consent must be accepted.'
  }

  if (
    !Number.isFinite(body.amountGdes) ||
    typeof body.amountGdes !== 'number' ||
    body.amountGdes <= 0
  ) {
    return 'A valid amount in HTG is required.'
  }

  if (body.amountGdes > MAX_MONCASH_TRANSACTION_GDES) {
    return 'MonCash accepts a maximum of 75000 HTG per transaction.'
  }

  const phone = value(body, 'phone').replace(/\D/g, '')

  if (
    ![8, 11].includes(phone.length) ||
    (phone.length === 11 && !phone.startsWith('509'))
  ) {
    return 'A valid MonCash phone number is required.'
  }

  if (
    !body.signatureDataUrl?.startsWith('data:image/png;base64,') ||
    body.signatureDataUrl.length > MAX_SIGNATURE_DATA_URL_LENGTH
  ) {
    return 'A valid PNG signature is required.'
  }

  return null
}

export async function POST(request: Request) {
  let body: StartInvestmentBody

  try {
    body = (await request.json()) as StartInvestmentBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const validationError = validateBody(body)

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const locale = SUPPORTED_LOCALES.has(body.locale || '') ? body.locale : 'fr'
  const origin = getAppOrigin(request)
  const referenceId = `VV-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
  const signedAt = new Date().toISOString()
  const mode = hasBazikCredentials() ? 'live' : 'demo'

  const investment = await createInvestment({
    referenceId,
    signedAt,
    sourcePdf: SOURCE_PDF,
    investor: {
      fullName: value(body, 'fullName'),
      birthDate: value(body, 'birthDate'),
      identityDocument: value(body, 'identityDocument'),
      address: value(body, 'address'),
      phone: value(body, 'phone'),
      email: value(body, 'email'),
      contractNumber: value(body, 'contractNumber')
    },
    projectName: value(body, 'projectName'),
    amountGdes: body.amountGdes as number,
    signatureDataUrl: body.signatureDataUrl as string,
    consentAccepted: true,
    legal: {
      ipAddress: getClientIp(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      acceptanceText: ACCEPTANCE_TEXT
    },
    payment: {
      provider: 'bazik-moncash',
      mode,
      status: 'not_created'
    }
  })

  if (mode === 'demo') {
    const demoOrderId = `demo-${investment.id}`
    const redirectUrl = `${origin}/${locale}/paiement/demo?investmentId=${investment.id}`

    const updated = await updateInvestment(investment.id, current => ({
      ...current,
      payment: {
        ...current.payment,
        status: 'pending',
        orderId: demoOrderId,
        redirectUrl
      },
      events: [
        createInvestmentEvent(
          'payment.demo_created',
          'Demo MonCash payment created.',
          { orderId: demoOrderId }
        ),
        ...current.events
      ]
    }))

    return NextResponse.json({
      investmentId: investment.id,
      referenceId,
      payment: updated?.payment,
      redirectUrl,
      mode
    })
  }

  try {
    const { firstName, lastName } = getNames(investment.investor.fullName)
    const payment = await createMoncashPayment({
      gdes: investment.amountGdes,
      userID: getBazikUserId(),
      referenceId,
      description: `Investissement ${investment.projectName}`,
      customerFirstName: firstName,
      customerLastName: lastName,
      customerEmail: investment.investor.email,
      webhookUrl: `${origin}/api/bazik/webhook`,
      successUrl: `${origin}/${locale}/paiement/succes?investmentId=${investment.id}`,
      errorUrl: `${origin}/${locale}/paiement/erreur?investmentId=${investment.id}`,
      metadata: {
        investmentId: investment.id,
        contractNumber: investment.investor.contractNumber,
        referenceId,
        sourcePdfSha256: SOURCE_PDF.sha256
      }
    })
    const normalizedPayment = normalizeBazikPaymentResponse(payment)

    if (!normalizedPayment.redirectUrl) {
      throw new Error('Bazik did not return a MonCash redirect URL.')
    }

    const updated = await updateInvestment(investment.id, current => ({
      ...current,
      payment: {
        ...current.payment,
        status: 'pending',
        orderId: normalizedPayment.orderId,
        redirectUrl: normalizedPayment.redirectUrl,
        raw: payment
      },
      events: [
        createInvestmentEvent('payment.created', 'Bazik payment created.', {
          orderId: normalizedPayment.orderId,
          receiver: normalizedPayment.receiver
        }),
        ...current.events
      ]
    }))

    return NextResponse.json({
      investmentId: investment.id,
      referenceId,
      payment: updated?.payment,
      redirectUrl: normalizedPayment.redirectUrl,
      mode
    })
  } catch (error) {
    const details = describeBazikError(error)

    console.error('Bazik payment creation failed.', {
      investmentId: investment.id,
      referenceId,
      status: details.status,
      message: details.message
    })

    await updateInvestment(investment.id, current => ({
      ...current,
      payment: {
        ...current.payment,
        status: 'failed',
        raw: details.body
      },
      events: [
        createInvestmentEvent(
          'payment.create_failed',
          'Bazik payment creation failed.',
          { status: details.status, message: details.message }
        ),
        ...current.events
      ]
    }))

    return NextResponse.json(
      {
        error: "Le paiement MonCash n'a pas pu etre cree.",
        investmentId: investment.id,
        referenceId,
        status: details.status
      },
      { status: 502 }
    )
  }
}
