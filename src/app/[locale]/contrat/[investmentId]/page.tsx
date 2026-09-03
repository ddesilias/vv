/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation'
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiCreditCard
} from 'react-icons/fi'
import { getInvestment } from '@/src/server/investments'
import { PrintButton } from '../../components/PrintButton'

const contractCopy = {
  fr: {
    paymentLabels: {
      not_created: 'Non cree',
      pending: 'En attente',
      successful: 'Confirme',
      failed: 'Echoue',
      cancelled: 'Annule'
    },
    unavailable: 'Non disponible',
    file: 'Dossier',
    signedContract: 'Contrat signe V&V Society',
    settlement: 'Règlement',
    newFile: 'Nouveau dossier',
    consentTitle: "Consentement d'investissement",
    fullName: 'Nom et prenom',
    birthDate: 'Date de naissance',
    identityDocument: "Piece d'identite",
    phone: 'Telephone',
    email: 'Courriel',
    contractNumber: 'Numero du contrat',
    address: 'Adresse',
    signedAt: 'Date de signature',
    declarationTitle: "Declaration d'investissement",
    declarationStart: 'Je soussigne(e)',
    declarationMiddle: 'reconnais avoir investi la somme de',
    declarationProject: 'dans le projet',
    declarationEnd:
      "Je reconnais avoir pris connaissance des conditions d'investissement de V&V Society et les accepter librement.",
    conditions: 'Conditions',
    conditionItems: [
      "L'investisseur beneficie des droits financiers sans participer a la gestion de l'entreprise.",
      'Les dividendes sont verses conformement a la politique de V&V Society.',
      "Le titre peut etre vendu ou transfere selon les politiques de l'institution.",
      "En cas de liquidation, les droits des investisseurs sont traites conformement aux lois applicables et aux engagements de l'institution.",
      'Le titre peut etre transfere aux heritiers ou a une personne designee.',
      "La valeur du titre est determinee selon les regles d'evaluation de V&V Society.",
      "Des frais administratifs peuvent s'appliquer lors d'un transfert.",
      'Les informations financieres internes sont confidentielles.',
      "L'acces au Conseil d'administration est soumis a l'approbation de V&V Society."
    ],
    investorSignature: 'Signature investisseur',
    signatureAlt: "Signature de l'investisseur",
    signedOn: 'Signe le',
    provider: 'Fournisseur',
    order: 'Commande',
    acceptance: 'Acceptation',
    ipAddress: 'Adresse IP',
    sourceModel: 'Modele source',
    sha256: 'Empreinte SHA-256',
    print: 'Imprimer'
  },
  ht: {
    paymentLabels: {
      not_created: 'Pa kreye',
      pending: 'Annatant',
      successful: 'Konfime',
      failed: 'Echwe',
      cancelled: 'Anile'
    },
    unavailable: 'Pa disponib',
    file: 'Dosye',
    signedContract: 'Kontra V&V Society ki siyen',
    settlement: 'Règleman',
    newFile: 'Nouvo dosye',
    consentTitle: 'Konsantman envestisman',
    fullName: 'Non ak prenon',
    birthDate: 'Dat nesans',
    identityDocument: 'Pyès idantite',
    phone: 'Telefòn',
    email: 'Imèl',
    contractNumber: 'Nimewo kontra',
    address: 'Adrès',
    signedAt: 'Dat siyati',
    declarationTitle: 'Deklarasyon envestisman',
    declarationStart: 'Mwen menm',
    declarationMiddle: 'rekonèt mwen envesti montan',
    declarationProject: 'nan pwojè',
    declarationEnd:
      'Mwen rekonèt mwen li kondisyon envestisman V&V Society yo epi mwen aksepte yo lib.',
    conditions: 'Kondisyon',
    conditionItems: [
      'Envestisè a resevwa dwa finansye san li pa patisipe nan jesyon antrepriz la.',
      'Dividann yo peye selon politik V&V Society.',
      'Tit la ka vann oswa transfere selon politik enstitisyon an.',
      'Si gen likidasyon, dwa envestisè yo trete selon lwa ki aplikab yo ak angajman enstitisyon an.',
      'Tit la ka transfere bay eritye yo oswa bay yon moun ki deziyen.',
      'Valè tit la detèmine selon règ evalyasyon V&V Society.',
      'Frè administratif ka aplike lè gen transfè.',
      'Enfòmasyon finansye entèn yo konfidansyèl.',
      'Aksè nan Konsèy administrasyon an depann de apwobasyon V&V Society.'
    ],
    investorSignature: 'Siyati envestisè',
    signatureAlt: 'Siyati envestisè a',
    signedOn: 'Siyen jou',
    provider: 'Founisè',
    order: 'Kòmann',
    acceptance: 'Akseptasyon',
    ipAddress: 'Adrès IP',
    sourceModel: 'Modèl sous',
    sha256: 'Anprent SHA-256',
    print: 'Enprime'
  }
}

function getContractCopy(locale: string) {
  return locale === 'ht' ? contractCopy.ht : contractCopy.fr
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-CA', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(new Date(value))
}

function Detail({
  label,
  value,
  unavailable
}: {
  label: string
  value: string | number | undefined
  unavailable?: string
}) {
  return (
    <div className='min-w-0 border-b border-slate-100 py-3 last:border-b-0 sm:border-b-0 sm:py-0'>
      <p className='text-xs font-bold uppercase tracking-[0.16em] text-slate-500'>
        {label}
      </p>
      <p className='mt-1 break-words text-sm font-semibold text-slate-950'>
        {value || unavailable || 'Non disponible'}
      </p>
    </div>
  )
}

export default async function ContractPage({
  params
}: {
  params: { investmentId: string; locale: string }
}) {
  const investment = await getInvestment(params.investmentId)
  const copy = getContractCopy(params.locale)

  if (!investment) {
    notFound()
  }

  const isPaid = investment.payment.status === 'successful'

  return (
    <div className='min-h-screen bg-[#f7f8fb] px-3 py-4 text-slate-950 sm:px-6 lg:py-8 print:bg-white'>
      <section className='mx-auto max-w-5xl'>
        <div className='overflow-hidden rounded-md border border-slate-200 bg-[#111516] text-white shadow-sm print:hidden'>
          <div className='grid gap-5 px-5 py-6 sm:px-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center'>
            <div className='min-w-0'>
              <p className='text-xs font-bold uppercase tracking-[0.16em] text-slate-300'>
                {copy.file} {investment.referenceId}
              </p>
              <h1 className='mt-2 text-3xl font-semibold tracking-normal'>
                {copy.signedContract}
              </h1>
              <div
                className={`mt-4 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
                  isPaid
                    ? 'bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-200/20'
                    : 'bg-white/10 text-slate-100 ring-1 ring-white/15'
                }`}
              >
                {isPaid ? (
                  <FiCheckCircle aria-hidden='true' />
                ) : (
                  <FiClock aria-hidden='true' />
                )}
                {copy.settlement} {copy.paymentLabels[investment.payment.status]}
              </div>
            </div>
            <div className='grid gap-3 sm:flex sm:flex-wrap'>
              <PrintButton label={copy.print} />
              <a
                href={`/${params.locale}/investir`}
                className='inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15'
              >
                <FiArrowLeft aria-hidden='true' />
                {copy.newFile}
              </a>
            </div>
          </div>
        </div>

        <article className='mt-5 rounded-md border border-slate-200 bg-white p-5 text-[15px] leading-7 text-slate-950 shadow-sm sm:p-8 print:mt-0 print:border-0 print:p-0 print:shadow-none'>
          <div className='text-center'>
            <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-md bg-white p-2 shadow-sm ring-1 ring-slate-200 print:border print:border-slate-300 print:shadow-none print:ring-0'>
              <img
                src='/images/vv-logo.png'
                alt='Logo V&V Society'
                className='h-full w-full object-contain'
              />
            </div>
            <h2 className='text-2xl font-bold uppercase tracking-normal text-[#238DCA]'>
              {copy.consentTitle}
            </h2>
            <p className='text-lg font-bold uppercase text-slate-800'>
              V&V Society
            </p>
          </div>

          <div className='mt-8 grid gap-0 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 sm:gap-4 print:bg-white'>
            <Detail
              label={copy.fullName}
              value={investment.investor.fullName}
              unavailable={copy.unavailable}
            />
            <Detail
              label={copy.birthDate}
              value={investment.investor.birthDate}
              unavailable={copy.unavailable}
            />
            <Detail
              label={copy.identityDocument}
              value={investment.investor.identityDocument}
              unavailable={copy.unavailable}
            />
            <Detail
              label={copy.phone}
              value={investment.investor.phone}
              unavailable={copy.unavailable}
            />
            <Detail
              label={copy.email}
              value={investment.investor.email}
              unavailable={copy.unavailable}
            />
            <Detail
              label={copy.contractNumber}
              value={investment.investor.contractNumber}
              unavailable={copy.unavailable}
            />
            <Detail
              label={copy.address}
              value={investment.investor.address}
              unavailable={copy.unavailable}
            />
            <Detail
              label={copy.signedAt}
              value={formatDate(investment.signedAt)}
              unavailable={copy.unavailable}
            />
          </div>

          <div className='mt-7'>
            <h3 className='text-lg font-bold text-[#238DCA]'>
              {copy.declarationTitle}
            </h3>
            <p className='mt-3'>
              {copy.declarationStart} {investment.investor.fullName}{' '}
              {copy.declarationMiddle}{' '}
              {investment.amountGdes.toLocaleString('fr-CA')} HTG{' '}
              {copy.declarationProject} {investment.projectName}.{' '}
              {copy.declarationEnd}
            </p>
          </div>

          <div className='mt-7'>
            <h3 className='text-lg font-bold text-[#238DCA]'>
              {copy.conditions}
            </h3>
            <ol className='mt-3 grid list-decimal gap-2 pl-5'>
              {copy.conditionItems.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>

          <div className='mt-8 grid gap-5 border-t border-slate-200 pt-5 md:grid-cols-2'>
            <div>
              <p className='font-bold text-[#238DCA]'>
                {copy.investorSignature}
              </p>
              <img
                src={investment.signatureDataUrl}
                alt={copy.signatureAlt}
                className='mt-2 h-28 w-full rounded-md border border-slate-200 bg-white object-contain'
              />
              <p className='mt-2 text-sm text-slate-600'>
                {copy.signedOn} {formatDate(investment.signedAt)}
              </p>
            </div>
            <div>
              <p className='font-bold text-[#238DCA]'>{copy.settlement}</p>
              <div className='mt-2 flex flex-wrap items-center gap-2'>
                <span
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
                    isPaid
                      ? 'bg-[#EAF7FF] text-[#238DCA]'
                      : 'bg-[#FFF4C7] text-[#5D4700]'
                  }`}
                >
                  <FiCreditCard aria-hidden='true' />
                  {copy.paymentLabels[investment.payment.status]}
                </span>
              </div>
              <p className='mt-3 text-sm text-slate-600'>
                {copy.provider} : Bazik MonCash
              </p>
              <p className='break-all text-sm text-slate-600'>
                {copy.order} : {investment.payment.orderId || copy.unavailable}
              </p>
            </div>
          </div>

          <div className='mt-8 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 print:bg-white'>
            <p>
              <strong>{copy.acceptance} :</strong>{' '}
              {investment.legal.acceptanceText}
            </p>
            <p>
              <strong>{copy.ipAddress} :</strong> {investment.legal.ipAddress}
            </p>
            <p>
              <strong>{copy.sourceModel} :</strong>{' '}
              {investment.sourcePdf.fileName}
            </p>
            <p className='break-all'>
              <strong>{copy.sha256} :</strong> {investment.sourcePdf.sha256}
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}
