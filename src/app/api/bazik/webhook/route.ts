import { NextResponse } from 'next/server'
import {
  createInvestmentEvent,
  findInvestmentByOrderId,
  findInvestmentByReferenceId,
  hasProcessedWebhookEvent,
  normalizePaymentStatus,
  updateInvestment
} from '@/src/server/investments'
import {
  hasBazikWebhookSecret,
  verifyBazikWebhookSignature
} from '@/src/server/bazik'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type BazikWebhookBody = {
  type?: string
  orderId?: string
  transactionId?: string
  status?: string
  amount?: number
  currency?: string
  referenceId?: string
  timestamp?: string
  failureReason?: string | null
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const timestamp = request.headers.get('x-bazik-timestamp')
  const eventId = request.headers.get('x-bazik-event-id')
  const signature = request.headers.get('x-bazik-signature')
  const bazikEnv = request.headers.get('x-bazik-env')

  if (!hasBazikWebhookSecret()) {
    return NextResponse.json(
      { error: 'Bazik webhook secret is not configured.' },
      { status: 500 }
    )
  }

  if (
    !verifyBazikWebhookSignature({
      rawBody,
      timestamp,
      eventId,
      signature
    })
  ) {
    return NextResponse.json(
      { error: 'Invalid Bazik webhook signature.' },
      { status: 401 }
    )
  }

  let body: BazikWebhookBody

  try {
    body = JSON.parse(rawBody) as BazikWebhookBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const orderId = body.orderId
  const referenceId = body.referenceId

  if (!orderId && !referenceId) {
    return NextResponse.json(
      { error: 'orderId or referenceId is required.' },
      { status: 400 }
    )
  }

  const investment =
    (orderId ? await findInvestmentByOrderId(orderId) : null) ||
    (referenceId ? await findInvestmentByReferenceId(referenceId) : null)

  if (!investment) {
    console.warn('Signed Bazik webhook did not match an investment.', {
      orderId,
      referenceId,
      eventId
    })

    return NextResponse.json({ received: true, matched: false })
  }

  if (
    hasProcessedWebhookEvent(investment, {
      eventId: eventId || undefined,
      transactionId: body.transactionId
    })
  ) {
    return NextResponse.json({
      received: true,
      duplicate: true,
      investmentId: investment.id
    })
  }

  const paymentStatus = normalizePaymentStatus(body)
  const receivedAt = new Date().toISOString()
  const updated = await updateInvestment(investment.id, current => ({
    ...current,
    payment: {
      ...current.payment,
      status: paymentStatus,
      orderId: orderId || current.payment.orderId,
      verifiedAt: receivedAt,
      raw: body
    },
    events: [
      createInvestmentEvent(
        'payment.webhook_received',
        'Bazik webhook received.',
        {
          eventId: eventId || undefined,
          transactionId: body.transactionId,
          orderId,
          referenceId,
          bazikEnv,
          type: body.type,
          status: body.status || paymentStatus
        }
      ),
      ...current.events
    ]
  }))

  return NextResponse.json({
    received: true,
    investmentId: updated?.id,
    status: updated?.payment.status
  })
}
