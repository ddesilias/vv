import { NextResponse } from 'next/server'
import {
  createInvestmentEvent,
  getInvestment,
  normalizePaymentStatus,
  updateInvestment
} from '@/src/server/investments'
import {
  describeBazikError,
  hasBazikCredentials,
  verifyMoncashPayment
} from '@/src/server/bazik'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { investmentId: string } }
) {
  const investment = await getInvestment(params.investmentId)

  if (!investment) {
    return NextResponse.json(
      { error: 'Investment not found.' },
      { status: 404 }
    )
  }

  if (investment.payment.mode === 'demo' || !hasBazikCredentials()) {
    return NextResponse.json({
      investment,
      message: 'Bazik live verification is not configured.'
    })
  }

  const orderId = investment.payment.orderId

  if (!orderId) {
    return NextResponse.json(
      { error: 'No Bazik orderId is attached to this investment.' },
      { status: 400 }
    )
  }

  try {
    const verification = await verifyMoncashPayment(orderId)
    const paymentStatus = normalizePaymentStatus(verification)
    const verifiedAt = new Date().toISOString()

    const updated = await updateInvestment(investment.id, current => ({
      ...current,
      payment: {
        ...current.payment,
        status: paymentStatus,
        verifiedAt,
        raw: verification
      },
      events: [
        createInvestmentEvent('payment.verified', 'Bazik payment verified.', {
          orderId,
          status: paymentStatus
        }),
        ...current.events
      ]
    }))

    return NextResponse.json({ investment: updated, verification })
  } catch (error) {
    const details = describeBazikError(error)

    console.error('Bazik payment verification failed.', {
      investmentId: investment.id,
      orderId,
      status: details.status,
      message: details.message
    })

    return NextResponse.json(
      {
        error: "Le paiement MonCash n'a pas pu etre verifie.",
        status: details.status
      },
      { status: 502 }
    )
  } finally {
    await request.body?.cancel().catch(() => undefined)
  }
}
