import { NextResponse } from 'next/server'
import {
  createInvestmentEvent,
  getInvestment,
  updateInvestment
} from '@/src/server/investments'
import { hasBazikCredentials } from '@/src/server/bazik'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type DemoPaymentBody = {
  investmentId?: string
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as DemoPaymentBody
  const investmentId = body.investmentId

  if (!investmentId) {
    return NextResponse.json(
      { error: 'investmentId is required.' },
      { status: 400 }
    )
  }

  const investment = await getInvestment(investmentId)

  if (!investment) {
    return NextResponse.json(
      { error: 'Investment not found.' },
      { status: 404 }
    )
  }

  if (investment.payment.mode !== 'demo' && hasBazikCredentials()) {
    return NextResponse.json(
      { error: 'Demo payment is disabled for live Bazik records.' },
      { status: 403 }
    )
  }

  const paidAt = new Date().toISOString()
  const updated = await updateInvestment(investmentId, current => ({
    ...current,
    payment: {
      ...current.payment,
      status: 'successful',
      verifiedAt: paidAt,
      raw: {
        status: 'successful',
        mode: 'demo'
      }
    },
    events: [
      createInvestmentEvent('payment.demo_paid', 'Demo payment confirmed.', {
        paidAt
      }),
      ...current.events
    ]
  }))

  return NextResponse.json({ investment: updated })
}
