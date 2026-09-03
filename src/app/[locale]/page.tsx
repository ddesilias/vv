import Image from 'next/image'
import {
  FiArrowRight,
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiCreditCard,
  FiFileText,
  FiLock,
  FiShield,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi'

const serviceIcons = [
  <FiBriefcase aria-hidden='true' key='assets' />,
  <FiShield aria-hidden='true' key='construction' />,
  <FiTrendingUp aria-hidden='true' key='commerce' />,
  <FiUsers aria-hidden='true' key='advice' />
]

const flowIcons = [
  <FiFileText aria-hidden='true' key='file' />,
  <FiCheckCircle aria-hidden='true' key='consent' />,
  <FiCreditCard aria-hidden='true' key='settlement' />,
  <FiBarChart2 aria-hidden='true' key='tracking' />
]

const landingCopy = {
  fr: {
    brandLong: 'V&V Society',
    heroImage: '/images/vv-business-card.png',
    spotlightImage: '/images/vv-business-card.png',
    spotlightAlt: 'Carte de présentation V&V Society',
    heroTitle: 'V&V Society',
    heroText:
      'Gestion d’actifs, construction, achat et vente de produits, puis accompagnement des entreprises pour bâtir des solutions viables en Haïti.',
    heroTagline: 'Une équipe pour rebâtir avec rigueur et confiance.',
    primaryCta: 'Ouvrir un dossier investisseur',
    consentCta: 'Voir le consentement',
    highlights: [
      {
        label: 'Société en nom collectif',
        detail:
          'Fondée le 01 septembre 2024 pour faire des actes de commerce et organiser des services utiles.'
      },
      {
        label: 'Cadre de confiance',
        detail:
          'Confidentialité, protection des données et preuves de consentement conservées ensemble.'
      },
      {
        label: 'Services numériques',
        detail:
          'Dossiers, consentements, preuves et règlements sont organisés dans un même espace.'
      }
    ],
    servicesEyebrow: 'Services',
    servicesTitle: 'Une entreprise pensée pour gérer, construire et accompagner.',
    servicesText:
      'V&V Society agit sur quatre axes: gestion des actifs, construction, vente de produits et conseil. Le but est clair: améliorer les conditions de vie en créant des solutions économiques viables.',
    services: [
      {
        title: 'Gestion des actifs',
        text: 'Immobilier, écoles, véhicules et biens confiés par leurs propriétaires pour en préserver la valeur et l’usufruit.'
      },
      {
        title: 'Construction',
        text: 'Des services de construction structurés pour accompagner les projets utiles aux familles, aux entreprises et aux communautés.'
      },
      {
        title: 'Achat et vente',
        text: 'Organisation de produits divers, suivi commercial et amélioration des habitudes de gestion pour les petits commerçants.'
      },
      {
        title: 'Conseil',
        text: 'Accompagnement administratif, financier et opérationnel pour aider les membres et clients à prendre de meilleures décisions.'
      }
    ],
    managementEyebrow: 'Entreprises et commerçants',
    managementTitle: 'V&V pour vous aider à gérer votre entreprise.',
    managementText:
      'Le cahier V&V aide les commerçants à suivre ventes, achats, dépenses, inventaire, crédit client et marge bénéficiaire. Les données collectées servent ensuite à proposer des conseils pratiques pour améliorer la gestion.',
    values: [
      'Confidentialité des informations et des projets en cours',
      'Loyauté, intégrité et honnêteté dans les engagements',
      'Protection des données sensibles et accès contrôlés',
      'Investissements qui respectent l’environnement'
    ],
    portalBadge: 'Portail V&V',
    portalTitle: 'Un espace clair pour gérer les dossiers de l’entreprise.',
    portalText:
      'Le portail centralise les informations, le consentement, les preuves et le suivi administratif. Quand un règlement est requis, MonCash est disponible dans le parcours via Bazik.',
    portalCta: 'Créer un dossier',
    flow: [
      {
        label: 'Dossier',
        detail: 'Identité, coordonnées, projet et numéro de contrat.'
      },
      {
        label: 'Consentement',
        detail: 'Lecture du document source et signature numérique.'
      },
      {
        label: 'Règlement',
        detail:
          'Option MonCash disponible via Bazik lorsque le dossier le demande.'
      },
      {
        label: 'Suivi',
        detail: 'Statut, preuve, audit et contrat final consultable.'
      }
    ],
    finalBadge: 'Dossiers V&V',
    finalTitle: 'Créer un nouveau dossier V&V Society.',
    finalText:
      'Le parcours guide les membres dans la création d’un dossier, la signature du consentement et le suivi des engagements avec un cadre professionnel.',
    finalCta: 'Ouvrir le parcours'
  },
  ht: {
    brandLong: 'V&V Society',
    heroImage: '/images/vv-society-marketing.png',
    spotlightImage: '/images/vv-society-marketing.png',
    spotlightAlt: 'Afich V&V Society an kreyòl ayisyen',
    heroTitle: 'V&V Society',
    heroText:
      'Jesyon byen, konstriksyon, acha ak vant pwodwi, ansanm ak akonpayman antrepriz pou bati solisyon solid ann Ayiti.',
    heroTagline: 'Ak V&V, sèvis lakay ou byenw asire.',
    primaryCta: 'Louvri yon dosye envestisè',
    consentCta: 'Wè konsantman an',
    highlights: [
      {
        label: 'Sosyete an non kolektif',
        detail:
          'Li te fonde 01 septanm 2024 pou fè aktivite komèsyal epi òganize sèvis itil.'
      },
      {
        label: 'Kad konfyans',
        detail:
          'Konfidansyalite, pwoteksyon done ak prèv konsantman rete ansanm.'
      },
      {
        label: 'Sèvis nimerik',
        detail:
          'Dosye, konsantman, prèv ak règleman yo òganize nan menm espas la.'
      }
    ],
    servicesEyebrow: 'Sèvis',
    servicesTitle: 'Yon antrepriz ki fèt pou jere, konstwi ak akonpaye.',
    servicesText:
      'V&V Society travay sou kat aks: jesyon byen, konstriksyon, vant pwodwi ak konsèy. Objektif la klè: amelyore kondisyon lavi atravè solisyon ekonomik ki solid.',
    services: [
      {
        title: 'Jesyon byen',
        text: 'Kay, lekòl, machin ak lòt byen pwopriyetè yo konfye pou pwoteje valè yo ak dwa itilizasyon yo.'
      },
      {
        title: 'Konstriksyon',
        text: 'Sèvis konstriksyon ki byen òganize pou akonpaye pwojè fanmi, antrepriz ak kominote.'
      },
      {
        title: 'Acha ak vant',
        text: 'Òganizasyon pwodwi divès, swivi komèsyal ak amelyorasyon fason ti komèsan yo jere aktivite yo.'
      },
      {
        title: 'Konsèy',
        text: 'Akonpayman administratif, finansye ak operasyonèl pou ede manm yo ak kliyan yo pran pi bon desizyon.'
      }
    ],
    managementEyebrow: 'Antrepriz ak komèsan',
    managementTitle: 'V&V pou ede w jere antrepriz ou.',
    managementText:
      'Kaye V&V la ede komèsan yo swiv lavant, acha, depans, envantè, kredi kliyan ak maj benefis. Enfòmasyon yo sèvi pou bay konsèy pratik pou amelyore jesyon an.',
    values: [
      'Konfidansyalite enfòmasyon ak pwojè ki an kou yo',
      'Lwayote, entegrite ak onètete nan angajman yo',
      'Pwoteksyon done sansib ak aksè ki kontwole',
      'Envestisman ki respekte anviwònman an'
    ],
    portalBadge: 'Pòtay V&V',
    portalTitle: 'Yon espas klè pou jere dosye antrepriz la.',
    portalText:
      'Pòtay la santralize enfòmasyon, konsantman, prèv ak swivi administratif. Lè yon règleman nesesè, MonCash disponib nan parcours la atravè Bazik.',
    portalCta: 'Kreye yon dosye',
    flow: [
      {
        label: 'Dosye',
        detail: 'Idantite, kontak, pwojè ak nimewo kontra.'
      },
      {
        label: 'Konsantman',
        detail: 'Lekti dokiman sous la ak siyati nimerik.'
      },
      {
        label: 'Règleman',
        detail: 'Opsyon MonCash disponib atravè Bazik lè dosye a mande sa.'
      },
      {
        label: 'Swivi',
        detail: 'Estati, prèv, odit ak kontra final ki ka konsilte.'
      }
    ],
    finalBadge: 'Dosye V&V',
    finalTitle: 'Kreye yon nouvo dosye V&V Society.',
    finalText:
      'Parcours la gide manm yo nan kreyasyon dosye, siyati konsantman ak swivi angajman yo nan yon kad pwofesyonèl.',
    finalCta: 'Louvri parcours la'
  }
}

function getLandingCopy(locale: string) {
  return locale === 'ht' ? landingCopy.ht : landingCopy.fr
}

export default function DashboardPage({
  params
}: {
  params: { locale: string }
}) {
  const investHref = `/${params.locale}/investir`
  const copy = getLandingCopy(params.locale)

  return (
    <div className='min-h-screen bg-[#f7f8fb] text-slate-950'>
      <section className='relative overflow-hidden bg-[#111516]'>
        <Image
          src={copy.heroImage}
          alt=''
          fill
          priority
          sizes='100vw'
          className='object-cover object-center opacity-65'
        />
        <div className='via-[#111516]/82 absolute inset-0 bg-gradient-to-r from-[#111516] to-[#111516]/30' />
        <div className='absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#111516] to-transparent' />

        <div className='relative z-10 mx-auto flex min-h-[calc(100svh-128px)] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:min-h-[calc(100vh-128px)] lg:px-8'>
          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-3 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur'>
              <span className='flex size-9 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-sm'>
                <Image
                  src='/images/vv-logo.png'
                  alt='Logo V&V Society'
                  width={36}
                  height={36}
                  className='h-full w-full object-contain'
                />
              </span>
              {copy.brandLong}
            </div>

            <h1 className='mt-6 text-5xl font-semibold leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl'>
              {copy.heroTitle}
            </h1>
            <p className='mt-5 max-w-2xl text-lg leading-8 text-slate-100 sm:text-xl'>
              {copy.heroText}
            </p>
            <p className='mt-4 max-w-xl text-sm font-bold uppercase tracking-[0.16em] text-[#FFD84D]'>
              {copy.heroTagline}
            </p>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <a
                href={investHref}
                className='inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#35AEEF] px-5 text-base font-semibold text-white transition hover:bg-[#238DCA]'
              >
                {copy.primaryCta}
                <FiArrowRight aria-hidden='true' />
              </a>
              <a
                href='/documents/Consentement_Investissement_VV_Society.pdf'
                className='inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/15'
              >
                <FiFileText aria-hidden='true' />
                {copy.consentCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-white px-4 py-10 sm:px-6 lg:px-8'>
        <div className='mx-auto grid max-w-7xl gap-4 md:grid-cols-3'>
          {copy.highlights.map((item, index) => (
            <div
              key={item.label}
              className='rounded-md border border-slate-200 bg-white p-5 shadow-sm'
            >
              <div className='flex size-10 items-center justify-center rounded-md bg-[#EAF7FF] text-[#238DCA]'>
                {index === 0 ? (
                  <FiShield aria-hidden='true' />
                ) : index === 1 ? (
                  <FiLock aria-hidden='true' />
                ) : (
                  <FiFileText aria-hidden='true' />
                )}
              </div>
              <h2 className='mt-4 text-lg font-semibold text-slate-950'>
                {item.label}
              </h2>
              <p className='mt-2 text-sm leading-6 text-slate-600'>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className='bg-[#f7f8fb] px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start'>
          <div>
            <p className='text-sm font-bold uppercase tracking-[0.16em] text-[#238DCA]'>
              {copy.servicesEyebrow}
            </p>
            <h2 className='mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl'>
              {copy.servicesTitle}
            </h2>
            <p className='mt-4 text-base leading-7 text-slate-600'>
              {copy.servicesText}
            </p>
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            {copy.services.map((item, index) => (
              <div
                key={item.title}
                className='rounded-md border border-slate-200 bg-white p-5 shadow-sm'
              >
                <div className='flex size-10 items-center justify-center rounded-md bg-[#111516] text-[#FFD84D]'>
                  {serviceIcons[index]}
                </div>
                <h3 className='mt-4 text-base font-semibold text-slate-950'>
                  {item.title}
                </h3>
                <p className='mt-2 text-sm leading-6 text-slate-600'>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-white px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center'>
          <div>
            <p className='text-sm font-bold uppercase tracking-[0.16em] text-[#238DCA]'>
              {copy.managementEyebrow}
            </p>
            <h2 className='mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl'>
              {copy.managementTitle}
            </h2>
            <p className='mt-4 text-base leading-7 text-slate-600'>
              {copy.managementText}
            </p>

            <div className='mt-6 grid gap-3 sm:grid-cols-2'>
              {copy.values.map(value => (
                <div
                  key={value}
                  className='flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm'
                >
                  <span className='mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-[#FFD84D] text-[#111516]'>
                    <FiCheckCircle aria-hidden='true' />
                  </span>
                  <p className='text-sm font-medium leading-6 text-slate-700'>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='overflow-hidden rounded-md border border-slate-200 bg-[#111516] shadow-sm'>
            <Image
              src={copy.spotlightImage}
              alt={copy.spotlightAlt}
              width={940}
              height={788}
              className='h-full w-full object-cover'
            />
          </div>
        </div>
      </section>

      <section className='bg-[#111516] px-4 py-12 text-white sm:px-6 lg:px-8'>
        <div className='mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start'>
          <div>
            <div className='inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/15'>
              <FiBriefcase aria-hidden='true' />
              {copy.portalBadge}
            </div>
            <h2 className='mt-4 text-3xl font-semibold tracking-normal sm:text-4xl'>
              {copy.portalTitle}
            </h2>
            <p className='mt-4 text-base leading-7 text-slate-300'>
              {copy.portalText}
            </p>
            <a
              href={investHref}
              className='mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#35AEEF] px-5 text-base font-semibold text-white transition hover:bg-[#238DCA]'
            >
              {copy.portalCta}
              <FiArrowRight aria-hidden='true' />
            </a>
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            {copy.flow.map((item, index) => (
              <div
                key={item.label}
                className='border-white/12 bg-white/8 rounded-md border p-5 ring-1 ring-white/10'
              >
                <div className='flex items-center justify-between gap-3'>
                  <div className='flex size-10 items-center justify-center rounded-md bg-white text-[#111516]'>
                    {flowIcons[index]}
                  </div>
                  <p className='text-xs font-bold uppercase tracking-[0.16em] text-[#FFD84D]'>
                    {String(index + 1).padStart(2, '0')}
                  </p>
                </div>
                <h3 className='mt-4 text-base font-semibold'>{item.label}</h3>
                <p className='mt-2 text-sm leading-6 text-slate-300'>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-white px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <div className='inline-flex items-center gap-2 rounded-md bg-[#FFF4C7] px-3 py-2 text-sm font-semibold text-[#5D4700]'>
              <FiTrendingUp aria-hidden='true' />
              {copy.finalBadge}
            </div>
            <h2 className='mt-4 text-3xl font-semibold tracking-normal text-slate-950'>
              {copy.finalTitle}
            </h2>
            <p className='mt-3 max-w-2xl text-base leading-7 text-slate-600'>
              {copy.finalText}
            </p>
          </div>
          <a
            href={investHref}
            className='inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#35AEEF] px-5 text-base font-semibold text-white transition hover:bg-[#238DCA]'
          >
            {copy.finalCta}
            <FiArrowRight aria-hidden='true' />
          </a>
        </div>
      </section>
    </div>
  )
}
