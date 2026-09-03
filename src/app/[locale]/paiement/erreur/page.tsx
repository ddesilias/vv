import { PaymentResult } from '../../components/PaymentResult'

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default function PaymentErrorPage({
  params,
  searchParams
}: {
  params: { locale: string }
  searchParams: { investmentId?: string | string[] }
}) {
  return (
    <PaymentResult
      locale={params.locale}
      investmentId={single(searchParams.investmentId)}
      result='error'
    />
  )
}
