'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
  FiExternalLink,
  FiFileText,
  FiRefreshCw
} from 'react-icons/fi'

type PaymentResultProps = {
  investmentId?: string
  locale: string
  result: 'success' | 'error' | 'demo'
}

type ApiState = {
  status: 'idle' | 'loading' | 'ready' | 'error'
  message: string
  paymentStatus?: string
}

const paymentCopy = {
  fr: {
    statusLabels: {
      successful: 'Confirme',
      pending: 'En attente',
      failed: 'Echoue',
      cancelled: 'Annule'
    },
    incomplete: "Le règlement n'a pas ete complete.",
    verifying: 'Verification du règlement.',
    missingContract: 'Identifiant de contrat manquant.',
    verificationFailed: 'Verification impossible.',
    confirmed: 'Règlement confirme.',
    pendingConfirmation: 'Règlement en attente de confirmation.',
    serverUnavailable: 'Le serveur est indisponible.',
    demoConfirming: 'Confirmation demo en cours.',
    demoFailed: 'Confirmation demo impossible.',
    demoConfirmed: 'Règlement demo confirme.',
    checking: 'Verification',
    actionRequired: 'Action requise',
    moncash: 'MonCash',
    contract: 'Contrat',
    status: 'Statut',
    demoTitle: 'Règlement demo',
    errorTitle: 'Règlement non confirme',
    returnTitle: 'Retour de règlement',
    confirmDemo: 'Confirmer le règlement demo',
    verifyAgain: 'Verifier a nouveau',
    viewContract: 'Voir le contrat',
    newFile: 'Nouveau dossier'
  },
  ht: {
    statusLabels: {
      successful: 'Konfime',
      pending: 'Annatant',
      failed: 'Echwe',
      cancelled: 'Anile'
    },
    incomplete: 'Règleman an pa fini.',
    verifying: 'Verifikasyon règleman an.',
    missingContract: 'Idantifyan kontra a manke.',
    verificationFailed: 'Verifikasyon an pa posib.',
    confirmed: 'Règleman an konfime.',
    pendingConfirmation: 'Règleman an ap tann konfimasyon.',
    serverUnavailable: 'Sèvè a pa disponib.',
    demoConfirming: 'Konfimasyon demo a ap fèt.',
    demoFailed: 'Konfimasyon demo a pa posib.',
    demoConfirmed: 'Règleman demo a konfime.',
    checking: 'Verifikasyon',
    actionRequired: 'Aksyon nesesè',
    moncash: 'MonCash',
    contract: 'Kontra',
    status: 'Estati',
    demoTitle: 'Règleman demo',
    errorTitle: 'Règleman pa konfime',
    returnTitle: 'Retou règleman',
    confirmDemo: 'Konfime règleman demo a',
    verifyAgain: 'Verifye ankò',
    viewContract: 'Wè kontra a',
    newFile: 'Nouvo dosye'
  }
}

function getPaymentCopy(locale: string) {
  return locale === 'ht' ? paymentCopy.ht : paymentCopy.fr
}

export function PaymentResult({
  investmentId,
  locale,
  result
}: PaymentResultProps) {
  const copy = getPaymentCopy(locale)
  const [state, setState] = useState<ApiState>({
    status: result === 'error' ? 'ready' : 'idle',
    message:
      result === 'error'
        ? copy.incomplete
        : copy.verifying
  })

  const verifyPayment = useCallback(async () => {
    if (!investmentId) {
      setState({
        status: 'error',
        message: copy.missingContract
      })
      return
    }

    setState({ status: 'loading', message: copy.verifying })

    try {
      const response = await fetch(`/api/investments/${investmentId}/verify`, {
        method: 'POST'
      })
      const data = await response.json()

      if (!response.ok) {
        setState({
          status: 'error',
          message: data.error || copy.verificationFailed
        })
        return
      }

      setState({
        status: 'ready',
        message:
          data.investment?.payment?.status === 'successful'
            ? copy.confirmed
            : copy.pendingConfirmation,
        paymentStatus: data.investment?.payment?.status
      })
    } catch {
      setState({
        status: 'error',
        message: copy.serverUnavailable
      })
    }
  }, [investmentId])

  async function confirmDemoPayment() {
    if (!investmentId) {
      setState({
        status: 'error',
        message: copy.missingContract
      })
      return
    }

    setState({ status: 'loading', message: copy.demoConfirming })

    try {
      const response = await fetch('/api/investments/demo-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investmentId })
      })
      const data = await response.json()

      if (!response.ok) {
        setState({
          status: 'error',
          message: data.error || copy.demoFailed
        })
        return
      }

      setState({
        status: 'ready',
        message: copy.demoConfirmed,
        paymentStatus: data.investment?.payment?.status
      })
    } catch {
      setState({
        status: 'error',
        message: copy.serverUnavailable
      })
    }
  }

  useEffect(() => {
    if (result === 'success') {
      verifyPayment()
    }
  }, [result, verifyPayment])

  const isPaid = state.paymentStatus === 'successful'
  const isLoading = state.status === 'loading'
  const isError = result === 'error' || state.status === 'error'
  const contractHref = investmentId
    ? `/${locale}/contrat/${investmentId}`
    : `/${locale}/investir`
  const visibleStatus =
    copy.statusLabels[
      (state.paymentStatus || '') as keyof typeof copy.statusLabels
    ] || (isLoading ? copy.checking : isError ? copy.actionRequired : copy.statusLabels.pending)

  return (
    <div className='min-h-screen bg-[#f7f8fb] px-3 py-5 text-slate-950 sm:px-6 sm:py-8'>
      <section className='mx-auto max-w-4xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm'>
        <div className='bg-[#111516] px-5 py-6 text-white sm:px-7'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold ring-1 ring-white/15'>
              <FiCreditCard aria-hidden='true' />
              {copy.moncash}
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold ${
                isError
                  ? 'bg-red-400/15 text-red-100 ring-1 ring-red-200/20'
                  : isPaid
                    ? 'bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-200/20'
                    : 'bg-white/10 text-slate-100 ring-1 ring-white/15'
              }`}
            >
              {isError ? (
                <FiAlertTriangle aria-hidden='true' />
              ) : isPaid ? (
                <FiCheckCircle aria-hidden='true' />
              ) : (
                <FiRefreshCw
                  className={isLoading ? 'animate-spin' : undefined}
                  aria-hidden='true'
                />
              )}
              {visibleStatus}
            </span>
          </div>
          <h1 className='mt-6 text-3xl font-semibold tracking-normal sm:text-4xl'>
            {result === 'demo'
              ? copy.demoTitle
              : isError
                ? copy.errorTitle
                : copy.returnTitle}
          </h1>
          <p className='mt-3 max-w-2xl text-base leading-7 text-slate-300'>
            {state.message}
          </p>
        </div>

        <div className='grid gap-5 p-5 sm:p-7'>
          <div className='grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.16em] text-slate-500'>
                {copy.contract}
              </p>
              <p className='mt-2 break-all text-sm font-semibold text-slate-950'>
                {investmentId || 'Non disponible'}
              </p>
            </div>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.16em] text-slate-500'>
                {copy.status}
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-950'>
                {visibleStatus}
              </p>
            </div>
          </div>

          {result === 'demo' && !isPaid ? (
            <button
              type='button'
              onClick={confirmDemoPayment}
              disabled={isLoading}
              className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#35AEEF] px-5 text-base font-semibold text-white transition hover:bg-[#238DCA] disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto'
            >
              {isLoading ? (
                <FiRefreshCw className='animate-spin' aria-hidden='true' />
              ) : (
                <FiCheckCircle aria-hidden='true' />
              )}
              {copy.confirmDemo}
            </button>
          ) : null}

          {result === 'success' && !isPaid ? (
            <button
              type='button'
              onClick={verifyPayment}
              disabled={isLoading}
              className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-5 text-base font-semibold text-slate-700 transition hover:border-[#35AEEF] hover:text-[#238DCA] disabled:cursor-not-allowed disabled:text-slate-400 sm:w-auto'
            >
              <FiRefreshCw
                className={isLoading ? 'animate-spin' : undefined}
                aria-hidden='true'
              />
              {copy.verifyAgain}
            </button>
          ) : null}

          <div className='grid gap-3 border-t border-slate-200 pt-5 sm:flex sm:flex-wrap'>
            <a
              href={contractHref}
              className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-base font-semibold text-white transition hover:bg-slate-800 sm:w-auto'
            >
              <FiFileText aria-hidden='true' />
              {copy.viewContract}
            </a>
            <a
              href={`/${locale}/investir`}
              className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-5 text-base font-semibold text-slate-700 transition hover:border-[#35AEEF] hover:text-[#238DCA] sm:w-auto'
            >
              {isPaid ? (
                <FiExternalLink aria-hidden='true' />
              ) : (
                <FiArrowLeft aria-hidden='true' />
              )}
              {copy.newFile}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
