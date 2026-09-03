'use client'

import Image from 'next/image'
import {
  FormEvent,
  PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  FiAlertTriangle,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiDownload,
  FiFileText,
  FiHash,
  FiLock,
  FiMail,
  FiMapPin,
  FiPenTool,
  FiPhone,
  FiRotateCcw,
  FiUser
} from 'react-icons/fi'

type FormState = {
  fullName: string
  birthDate: string
  identityDocument: string
  address: string
  phone: string
  email: string
  contractNumber: string
  projectName: string
  amountGdes: string
  consentAccepted: boolean
}

type InvestmentFlowProps = {
  locale: string
}

type StartResponse = {
  investmentId?: string
  redirectUrl?: string
  mode?: 'live' | 'demo'
  error?: string
}

type InputMode =
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal'
  | 'search'

const MAX_MONCASH_TRANSACTION_GDES = 75_000

const initialForm: FormState = {
  fullName: '',
  birthDate: '',
  identityDocument: '',
  address: '',
  phone: '',
  email: '',
  contractNumber: '',
  projectName: 'V&V Society',
  amountGdes: '',
  consentAccepted: false
}

const investmentCopy = {
  fr: {
    unavailableSignature: 'La signature est requise.',
    invalidAmount: 'Le montant doit etre superieur a zero.',
    maxAmount: 'MonCash accepte un maximum de 75 000 HTG par transaction.',
    settlementUnavailable: 'Règlement indisponible.',
    settlementCreationFailed: 'Impossible de creer le règlement.',
    settlementMissingRedirect:
      'Le règlement a ete cree sans URL de redirection.',
    serverUnavailable: 'Le serveur est indisponible.',
    contractLabel: 'Contrat',
    brand: 'V&V Society',
    pdf: 'PDF',
    title: 'Investissement V&V Society',
    intro:
      'Completez le dossier, signez le consentement et finalisez le parcours investisseur.',
    amount: 'Montant',
    maxMonCash: 'Maximum MonCash: 75 000 HTG',
    step1: 'Etape 1',
    investor: 'Investisseur',
    fullName: 'Nom et prenom',
    fullNamePlaceholder: 'Jean Baptiste',
    birthDate: 'Date de naissance',
    identityDocument: "Piece d'identite",
    identityPlaceholder: 'CIN, passeport ou permis',
    moncashPhone: 'Telephone MonCash',
    phonePlaceholder: '47556677',
    phoneHelper: '8 chiffres, ou 509 + 8 chiffres.',
    email: 'Courriel',
    emailPlaceholder: 'nom@example.com',
    address: 'Adresse',
    addressPlaceholder: 'Adresse complete',
    step2: 'Etape 2',
    settlement: 'Règlement',
    contractNumber: 'Numero du contrat',
    project: 'Projet',
    amountHtg: 'Montant HTG',
    amountPlaceholder: '5000',
    settlementHelper: 'Règlement par MonCash en HTG.',
    step3: 'Etape 3',
    signature: 'Signature',
    signatureArea: "Zone de signature de l'investisseur",
    signatureReceived: 'Signature recue',
    signaturePending: 'Signature en attente',
    clear: 'Effacer',
    consentAccepted:
      "J'ai lu et j'accepte les conditions d'investissement de V&V Society.",
    submitting: 'Redirection MonCash...',
    submit: 'Signer et régler',
    file: 'Dossier',
    securedFile: 'Dossier securise V&V',
    investorInfo: 'Infos investisseur',
    amountAndContract: 'Montant et contrat',
    signatureAndAgreement: 'Signature et accord',
    sectionsReady: 'sections pretes',
    sourceConsent: 'Consentement source',
    sourceConsentText:
      'Le contrat final garde la signature, le suivi administratif et les preuves.',
    openPdf: 'Ouvrir le PDF',
    openPdfModel: 'Ouvrir le modele PDF'
  },
  ht: {
    unavailableSignature: 'Siyati a obligatwa.',
    invalidAmount: 'Montan an dwe plis pase zewo.',
    maxAmount: 'MonCash aksepte maksimòm 75 000 HTG pa tranzaksyon.',
    settlementUnavailable: 'Règleman an pa disponib.',
    settlementCreationFailed: 'Nou pa ka kreye règleman an.',
    settlementMissingRedirect:
      'Règleman an te kreye san adrès redireksyon.',
    serverUnavailable: 'Sèvè a pa disponib.',
    contractLabel: 'Kontra',
    brand: 'V&V Society',
    pdf: 'PDF',
    title: 'Envestisman V&V Society',
    intro: 'Ranpli dosye a, siyen konsantman an epi finalize parcours envestisè a.',
    amount: 'Montan',
    maxMonCash: 'Maksimòm MonCash: 75 000 HTG',
    step1: 'Etap 1',
    investor: 'Envestisè',
    fullName: 'Non ak prenon',
    fullNamePlaceholder: 'Jean Baptiste',
    birthDate: 'Dat nesans',
    identityDocument: 'Pyès idantite',
    identityPlaceholder: 'CIN, paspò oswa pèmi',
    moncashPhone: 'Telefòn MonCash',
    phonePlaceholder: '47556677',
    phoneHelper: '8 chif, oswa 509 + 8 chif.',
    email: 'Imèl',
    emailPlaceholder: 'non@example.com',
    address: 'Adrès',
    addressPlaceholder: 'Adrès konplè',
    step2: 'Etap 2',
    settlement: 'Règleman',
    contractNumber: 'Nimewo kontra',
    project: 'Pwojè',
    amountHtg: 'Montan HTG',
    amountPlaceholder: '5000',
    settlementHelper: 'Règleman pa MonCash an HTG.',
    step3: 'Etap 3',
    signature: 'Siyati',
    signatureArea: 'Zòn pou siyati envestisè a',
    signatureReceived: 'Siyati resevwa',
    signaturePending: 'Siyati annatant',
    clear: 'Efase',
    consentAccepted:
      'Mwen li e mwen aksepte kondisyon envestisman V&V Society yo.',
    submitting: 'Redireksyon MonCash...',
    submit: 'Siyen epi regle',
    file: 'Dosye',
    securedFile: 'Dosye V&V sekirize',
    investorInfo: 'Enfòmasyon envestisè',
    amountAndContract: 'Montan ak kontra',
    signatureAndAgreement: 'Siyati ak akò',
    sectionsReady: 'seksyon pare',
    sourceConsent: 'Konsantman sous',
    sourceConsentText:
      'Kontra final la konsève siyati a, swivi administratif la ak prèv yo.',
    openPdf: 'Louvri PDF la',
    openPdfModel: 'Louvri modèl PDF la'
  }
}

function getInvestmentCopy(locale: string) {
  return locale === 'ht' ? investmentCopy.ht : investmentCopy.fr
}

function formatAmount(value: string) {
  const amount = Number(value)

  if (!Number.isFinite(amount) || amount <= 0) {
    return '0 HTG'
  }

  return `${new Intl.NumberFormat('fr-CA').format(amount)} HTG`
}

function Field({
  icon,
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  helper,
  required = true,
  min,
  max,
  step,
  inputMode,
  autoComplete
}: {
  icon: React.ReactNode
  label: string
  name: keyof FormState
  type?: string
  value: string
  onChange: (name: keyof FormState, value: string) => void
  placeholder?: string
  helper?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  inputMode?: InputMode
  autoComplete?: string
}) {
  return (
    <label className='grid gap-2 text-sm font-semibold text-slate-800'>
      <span className='inline-flex items-center gap-2'>
        <span className='text-slate-400'>{icon}</span>
        {label}
      </span>
      <input
        className='h-12 rounded-md border border-slate-200 bg-white px-3 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#35AEEF] focus:ring-4 focus:ring-[#35AEEF]/15'
        name={name}
        type={type}
        value={value}
        required={required}
        min={min}
        max={max}
        step={step}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={event => onChange(name, event.target.value)}
      />
      {helper ? (
        <span className='text-xs font-medium leading-5 text-slate-500'>
          {helper}
        </span>
      ) : null}
    </label>
  )
}

function SectionBlock({
  icon,
  title,
  eyebrow,
  children
}: {
  icon: React.ReactNode
  title: string
  eyebrow: string
  children: React.ReactNode
}) {
  return (
    <section className='border-b border-slate-200 px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mb-5 flex items-start gap-3'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-md bg-[#EAF7FF] text-[#238DCA]'>
          {icon}
        </div>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.16em] text-slate-500'>
            {eyebrow}
          </p>
          <h2 className='mt-1 text-xl font-semibold text-slate-950'>{title}</h2>
        </div>
      </div>
      {children}
    </section>
  )
}

function ProgressItem({
  icon,
  label,
  complete
}: {
  icon: React.ReactNode
  label: string
  complete: boolean
}) {
  return (
    <div className='flex items-center gap-3 py-3'>
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-md ${
          complete ? 'bg-[#238DCA] text-white' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {complete ? <FiCheckCircle aria-hidden='true' /> : icon}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-semibold text-slate-900'>{label}</p>
      </div>
    </div>
  )
}

export function InvestmentFlow({ locale }: InvestmentFlowProps) {
  const copy = getInvestmentCopy(locale)
  const [form, setForm] = useState<FormState>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signatureDrawn, setSignatureDrawn] = useState(false)
  const [error, setError] = useState('')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    setForm(current => ({
      ...current,
      contractNumber:
        current.contractNumber || `VV-${new Date().getFullYear()}-${Date.now()}`
    }))
  }, [])

  const progress = useMemo(() => {
    const identityComplete = Boolean(
      form.fullName.trim() &&
        form.birthDate.trim() &&
        form.identityDocument.trim() &&
        form.address.trim() &&
        form.phone.trim() &&
        form.email.trim()
    )
    const paymentComplete = Boolean(
      form.projectName.trim() &&
        form.contractNumber.trim() &&
        Number(form.amountGdes) > 0 &&
        Number(form.amountGdes) <= MAX_MONCASH_TRANSACTION_GDES
    )
    const signatureComplete = signatureDrawn && form.consentAccepted
    const steps = [identityComplete, paymentComplete, signatureComplete]

    return {
      identityComplete,
      paymentComplete,
      signatureComplete,
      completed: steps.filter(Boolean).length,
      total: steps.length
    }
  }, [form, signatureDrawn])

  function updateField(name: keyof FormState, value: string) {
    setForm(current => ({ ...current, [name]: value }))
  }

  function getPoint(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current

    if (!canvas) {
      return null
    }

    const rect = canvas.getBoundingClientRect()

    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height
    }
  }

  function drawLine(
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) {
    const context = canvasRef.current?.getContext('2d')

    if (!context) {
      return
    }

    context.strokeStyle = '#111827'
    context.lineWidth = 3
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.beginPath()
    context.moveTo(from.x, from.y)
    context.lineTo(to.x, to.y)
    context.stroke()
  }

  function startDrawing(event: PointerEvent<HTMLCanvasElement>) {
    const point = getPoint(event)

    if (!point) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    drawingRef.current = true
    lastPointRef.current = point
    setSignatureDrawn(true)
  }

  function continueDrawing(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || !lastPointRef.current) {
      return
    }

    const point = getPoint(event)

    if (!point) {
      return
    }

    drawLine(lastPointRef.current, point)
    lastPointRef.current = point
  }

  function stopDrawing() {
    drawingRef.current = false
    lastPointRef.current = null
  }

  function clearSignature() {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context) {
      return
    }

    context.clearRect(0, 0, canvas.width, canvas.height)
    setSignatureDrawn(false)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const canvas = canvasRef.current
    const amountGdes = Number(form.amountGdes)

    if (!signatureDrawn || !canvas) {
      setError(copy.unavailableSignature)
      return
    }

    if (!Number.isFinite(amountGdes) || amountGdes <= 0) {
      setError(copy.invalidAmount)
      return
    }

    if (amountGdes > MAX_MONCASH_TRANSACTION_GDES) {
      setError(copy.maxAmount)
      return
    }

    setIsSubmitting(true)

    const payload = {
      ...form,
      locale,
      amountGdes,
      signatureDataUrl: canvas.toDataURL('image/png')
    }

    try {
      const response = await fetch('/api/investments/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = (await response.json()) as StartResponse

      if (!response.ok) {
        setError(
          data.investmentId
            ? `${data.error || copy.settlementUnavailable} ${copy.contractLabel}: ${data.investmentId}`
            : data.error || copy.settlementCreationFailed
        )
        return
      }

      if (data.redirectUrl) {
        window.location.assign(data.redirectUrl)
        return
      }

      setError(copy.settlementMissingRedirect)
    } catch {
      setError(copy.serverUnavailable)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#f7f8fb] text-slate-950'>
      <section className='mx-auto grid max-w-7xl gap-5 px-3 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-8'>
        <div className='overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm'>
          <div className='border-b border-slate-200 bg-[#111516] px-4 py-6 text-white sm:px-6 lg:px-8'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div className='inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-white ring-1 ring-white/15'>
                <span className='flex size-7 shrink-0 items-center justify-center rounded-md bg-white p-1'>
                  <Image
                    src='/images/vv-logo.png'
                    alt='Logo V&V Society'
                    width={28}
                    height={28}
                    className='h-full w-full object-contain'
                  />
                </span>
                {copy.brand}
              </div>
              <a
                href='/documents/Consentement_Investissement_VV_Society.pdf'
                className='inline-flex h-10 items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 text-sm font-semibold text-white transition hover:bg-white/15'
              >
                <FiDownload aria-hidden='true' />
                {copy.pdf}
              </a>
            </div>
            <div className='mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-end'>
              <div>
                <h1 className='max-w-2xl text-3xl font-semibold leading-tight tracking-normal sm:text-4xl'>
                  {copy.title}
                </h1>
                <p className='mt-3 max-w-2xl text-base leading-7 text-slate-300'>
                  {copy.intro}
                </p>
              </div>
              <div className='rounded-md border border-white/15 bg-white/10 p-4'>
                <p className='text-xs font-bold uppercase tracking-[0.16em] text-slate-300'>
                  {copy.amount}
                </p>
                <p className='mt-2 text-2xl font-semibold'>
                  {formatAmount(form.amountGdes)}
                </p>
                <p className='mt-1 text-sm text-slate-300'>
                  {copy.maxMonCash}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className='pb-0'>
            <SectionBlock
              icon={<FiUser aria-hidden='true' />}
              eyebrow={copy.step1}
              title={copy.investor}
            >
              <div className='grid gap-4 md:grid-cols-2'>
                <Field
                  icon={<FiUser aria-hidden='true' />}
                  label={copy.fullName}
                  name='fullName'
                  value={form.fullName}
                  autoComplete='name'
                  placeholder={copy.fullNamePlaceholder}
                  onChange={updateField}
                />
                <Field
                  icon={<FiCalendar aria-hidden='true' />}
                  label={copy.birthDate}
                  name='birthDate'
                  type='date'
                  value={form.birthDate}
                  autoComplete='bday'
                  onChange={updateField}
                />
                <Field
                  icon={<FiFileText aria-hidden='true' />}
                  label={copy.identityDocument}
                  name='identityDocument'
                  value={form.identityDocument}
                  placeholder={copy.identityPlaceholder}
                  onChange={updateField}
                />
                <Field
                  icon={<FiPhone aria-hidden='true' />}
                  label={copy.moncashPhone}
                  name='phone'
                  type='tel'
                  value={form.phone}
                  inputMode='tel'
                  autoComplete='tel'
                  placeholder={copy.phonePlaceholder}
                  helper={copy.phoneHelper}
                  onChange={updateField}
                />
                <Field
                  icon={<FiMail aria-hidden='true' />}
                  label={copy.email}
                  name='email'
                  type='email'
                  value={form.email}
                  inputMode='email'
                  autoComplete='email'
                  placeholder={copy.emailPlaceholder}
                  onChange={updateField}
                />
                <label className='grid gap-2 text-sm font-semibold text-slate-800 md:row-span-2'>
                  <span className='inline-flex items-center gap-2'>
                    <span className='text-slate-400'>
                      <FiMapPin aria-hidden='true' />
                    </span>
                    {copy.address}
                  </span>
                  <textarea
                    className='min-h-[132px] rounded-md border border-slate-200 bg-white px-3 py-3 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#35AEEF] focus:ring-4 focus:ring-[#35AEEF]/15'
                    name='address'
                    value={form.address}
                    required
                    autoComplete='street-address'
                    placeholder={copy.addressPlaceholder}
                    onChange={event =>
                      updateField('address', event.target.value)
                    }
                  />
                </label>
              </div>
            </SectionBlock>

            <SectionBlock
              icon={<FiCreditCard aria-hidden='true' />}
              eyebrow={copy.step2}
              title={copy.settlement}
            >
              <div className='grid gap-4 md:grid-cols-3'>
                <Field
                  icon={<FiHash aria-hidden='true' />}
                  label={copy.contractNumber}
                  name='contractNumber'
                  value={form.contractNumber}
                  onChange={updateField}
                />
                <Field
                  icon={<FiBriefcase aria-hidden='true' />}
                  label={copy.project}
                  name='projectName'
                  value={form.projectName}
                  onChange={updateField}
                />
                <Field
                  icon={<FiCreditCard aria-hidden='true' />}
                  label={copy.amountHtg}
                  name='amountGdes'
                  type='number'
                  value={form.amountGdes}
                  min={1}
                  max={MAX_MONCASH_TRANSACTION_GDES}
                  step={1}
                  inputMode='numeric'
                  placeholder={copy.amountPlaceholder}
                  helper={copy.settlementHelper}
                  onChange={updateField}
                />
              </div>
            </SectionBlock>

            <SectionBlock
              icon={<FiPenTool aria-hidden='true' />}
              eyebrow={copy.step3}
              title={copy.signature}
            >
              <div className='rounded-md border border-slate-200 bg-slate-50 p-3'>
                <div className='relative overflow-hidden rounded-md border border-slate-200 bg-white'>
                  <canvas
                    ref={canvasRef}
                    width={900}
                    height={240}
                    aria-label={copy.signatureArea}
                    className='h-44 w-full touch-none sm:h-52'
                    onPointerDown={startDrawing}
                    onPointerMove={continueDrawing}
                    onPointerUp={stopDrawing}
                    onPointerCancel={stopDrawing}
                    onPointerLeave={stopDrawing}
                  />
                  <div className='pointer-events-none absolute inset-x-6 bottom-8 border-t border-dashed border-slate-200' />
                </div>
                <div className='mt-3 flex flex-wrap items-center justify-between gap-3'>
                  <span
                    className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
                      signatureDrawn
                        ? 'bg-[#EAF7FF] text-[#238DCA]'
                        : 'bg-white text-slate-500 ring-1 ring-slate-200'
                    }`}
                  >
                    <FiCheckCircle aria-hidden='true' />
                    {signatureDrawn
                      ? copy.signatureReceived
                      : copy.signaturePending}
                  </span>
                  <button
                    type='button'
                    onClick={clearSignature}
                    className='inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-[#35AEEF] hover:text-[#238DCA]'
                  >
                    <FiRotateCcw aria-hidden='true' />
                    {copy.clear}
                  </button>
                </div>
              </div>

              <label className='mt-4 flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm'>
                <input
                  className='mt-1 size-5 shrink-0 accent-[#35AEEF]'
                  type='checkbox'
                  checked={form.consentAccepted}
                  required
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      consentAccepted: event.target.checked
                    }))
                  }
                />
                <span>
                  {copy.consentAccepted}
                </span>
              </label>

              {error ? (
                <div className='mt-4 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800'>
                  <FiAlertTriangle
                    className='mt-0.5 shrink-0'
                    aria-hidden='true'
                  />
                  <span>{error}</span>
                </div>
              ) : null}
            </SectionBlock>

            <div className='sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6 lg:static lg:px-8 lg:shadow-none'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#35AEEF] px-5 text-base font-semibold text-white transition hover:bg-[#238DCA] disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto'
              >
                <FiArrowRight aria-hidden='true' />
                {isSubmitting ? copy.submitting : copy.submit}
              </button>
            </div>
          </form>
        </div>

        <aside className='grid gap-5 self-start lg:sticky lg:top-24'>
          <div className='overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm'>
            <div className='bg-[#0f172a] p-5 text-white'>
              <p className='text-xs font-bold uppercase tracking-[0.16em] text-slate-300'>
                {copy.file}
              </p>
              <p className='mt-2 truncate text-lg font-semibold'>
                {form.contractNumber || 'V&V'}
              </p>
              <div className='mt-4 flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold'>
                <FiLock aria-hidden='true' />
                {copy.securedFile}
              </div>
            </div>
            <div className='divide-y divide-slate-100 px-5'>
              <ProgressItem
                icon={<FiUser aria-hidden='true' />}
                label={copy.investorInfo}
                complete={progress.identityComplete}
              />
              <ProgressItem
                icon={<FiCreditCard aria-hidden='true' />}
                label={copy.amountAndContract}
                complete={progress.paymentComplete}
              />
              <ProgressItem
                icon={<FiPenTool aria-hidden='true' />}
                label={copy.signatureAndAgreement}
                complete={progress.signatureComplete}
              />
            </div>
            <div className='border-t border-slate-100 p-5'>
              <div className='h-2 overflow-hidden rounded-full bg-slate-100'>
                <div
                  className='h-full rounded-full bg-[#35AEEF] transition-all'
                  style={{
                    width: `${(progress.completed / progress.total) * 100}%`
                  }}
                />
              </div>
              <p className='mt-3 text-sm font-medium text-slate-600'>
                {progress.completed}/{progress.total} {copy.sectionsReady}
              </p>
            </div>
          </div>

          <div className='rounded-md border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='flex items-start gap-3'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-md bg-[#FFF4C7] text-[#5D4700]'>
                <FiFileText aria-hidden='true' />
              </div>
              <div>
                <h2 className='text-base font-semibold text-slate-950'>
                  {copy.sourceConsent}
                </h2>
                <p className='mt-1 text-sm leading-6 text-slate-600'>
                  {copy.sourceConsentText}
                </p>
              </div>
            </div>
            <a
              href='/documents/Consentement_Investissement_VV_Society.pdf'
              className='mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-[#35AEEF] hover:text-[#238DCA]'
            >
              <FiFileText aria-hidden='true' />
              {copy.openPdf}
            </a>
          </div>

          <div className='hidden overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm xl:block'>
            <object
              data='/documents/Consentement_Investissement_VV_Society.pdf#toolbar=0&navpanes=0'
              type='application/pdf'
              className='h-[480px] w-full bg-slate-100'
            >
              <a
                className='block p-4 text-sm font-semibold text-[#238DCA]'
                href='/documents/Consentement_Investissement_VV_Society.pdf'
              >
                {copy.openPdfModel}
              </a>
            </object>
          </div>
        </aside>
      </section>
    </div>
  )
}
