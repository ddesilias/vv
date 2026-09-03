'use client'
import { Link } from '@/src/navigation'
import Image from 'next/image'
import { FC } from 'react'
import { FiBriefcase, FiFileText, FiShield } from 'react-icons/fi'
import LangSwitcher from './LangSwitcher'

interface Props {
  locale: string
}

const headerCopy = {
  fr: {
    tagline: 'Portail entreprise',
    home: 'Accueil',
    invest: 'Investir',
    consent: 'Consentement',
    openPdf: 'Ouvrir le PDF'
  },
  ht: {
    tagline: 'Pòtay antrepriz',
    home: 'Akèy',
    invest: 'Envesti',
    consent: 'Konsantman',
    openPdf: 'Louvri PDF la'
  }
}

function getHeaderCopy(locale: string) {
  return locale === 'ht' ? headerCopy.ht : headerCopy.fr
}

export const Header: FC<Props> = ({ locale }) => {
  const copy = getHeaderCopy(locale)

  return (
    <header className='sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-3 py-2.5 text-slate-950 backdrop-blur-xl'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3'>
        <Link lang={locale} href='/' className='min-w-0'>
          <div className='flex min-w-0 items-center gap-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-sm ring-1 ring-slate-200'>
              <Image
                src='/images/vv-logo.png'
                alt='Logo V&V Society'
                width={40}
                height={40}
                className='h-full w-full object-contain'
              />
            </div>
            <div className='min-w-0'>
              <strong className='block truncate text-sm font-semibold sm:text-base'>
                V&V Society
              </strong>
              <span className='block truncate text-xs font-medium text-slate-500'>
                {copy.tagline}
              </span>
            </div>
          </div>
        </Link>
        <div className='flex min-w-0 items-center gap-2'>
          <nav className='hidden items-center gap-2 text-sm font-semibold text-slate-700 md:flex'>
            <a
              className='inline-flex h-10 items-center gap-2 rounded-md px-3 transition hover:bg-[#EAF7FF] hover:text-[#238DCA]'
              href={`/${locale}`}
            >
              <FiShield aria-hidden='true' />
              {copy.home}
            </a>
            <a
              className='inline-flex h-10 items-center gap-2 rounded-md px-3 transition hover:bg-[#EAF7FF] hover:text-[#238DCA]'
              href={`/${locale}/investir`}
            >
              <FiBriefcase aria-hidden='true' />
              {copy.invest}
            </a>
            <a
              className='inline-flex h-10 items-center gap-2 rounded-md px-3 transition hover:bg-[#EAF7FF] hover:text-[#238DCA]'
              href='/documents/Consentement_Investissement_VV_Society.pdf'
            >
              <FiFileText aria-hidden='true' />
              {copy.consent}
            </a>
          </nav>
          <a
            aria-label={copy.openPdf}
            className='inline-flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#35AEEF] hover:text-[#238DCA] md:hidden'
            href='/documents/Consentement_Investissement_VV_Society.pdf'
          >
            <FiFileText aria-hidden='true' />
          </a>
          <LangSwitcher />
        </div>
      </div>
    </header>
  )
}
