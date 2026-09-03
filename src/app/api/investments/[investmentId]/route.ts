import { NextResponse } from 'next/server'
import { getInvestment } from '@/src/server/investments'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { investmentId: string } }
) {
  const investment = await getInvestment(params.investmentId)

  if (!investment) {
    return NextResponse.json(
      { error: 'Investment not found.' },
      { status: 404 }
    )
  }

  return NextResponse.json({ investment })
}
