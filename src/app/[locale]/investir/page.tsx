import { InvestmentFlow } from '../components/InvestmentFlow'

export default function InvestPage({ params }: { params: { locale: string } }) {
  return <InvestmentFlow locale={params.locale} />
}
