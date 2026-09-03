'use client'
import { capitalize } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegments } from 'next/navigation'
import React, { useState } from 'react'
import { FiGlobe } from 'react-icons/fi'

const LangSwitcher: React.FC = () => {
  interface Option {
    country: string
    code: string
  }
  const pathname = usePathname()
  const urlSegments = useSelectedLayoutSegments()

  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false)
  const options: Option[] = [
    { country: 'English', code: 'en' }, // Native name is the same
    { country: 'Kreyòl ayisyen', code: 'ht' },
    { country: 'Deutsch', code: 'de' },
    { country: 'Français', code: 'fr' },
    { country: 'Español', code: 'es' },
    { country: 'Русский', code: 'ru' },
    { country: '日本語', code: 'ja' },
    { country: 'العربية', code: 'ar' },
    { country: 'فارسی', code: 'fa' }
  ]
  const currentLanguage =
    options.find(lang => pathname?.startsWith(`/${lang.code}`)) || options[0]
  const languageLabel = currentLanguage.code === 'ht' ? 'Lang' : 'Langue'

  return (
    <div className='flex items-center justify-center'>
      <div className='relative'>
        <button
          type='button'
          className='inline-flex h-10 w-auto items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-0 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#35AEEF] hover:text-[#238DCA]'
          onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
          onBlur={() => setIsOptionsExpanded(false)}
        >
          <FiGlobe />
          <span className='hidden sm:inline'>{languageLabel}</span>
          <span className='uppercase'>{currentLanguage.code}</span>
        </button>
        {isOptionsExpanded && (
          <div className='absolute right-0 z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg'>
            <div
              className='py-1'
              role='menu'
              aria-orientation='vertical'
              aria-labelledby='options-menu'
            >
              {options.map(lang => {
                return (
                  <Link
                    key={lang.code}
                    href={`/${lang.code}/${urlSegments.join('/')}`}
                  >
                    <button
                      lang={lang.code}
                      onMouseDown={e => {
                        e.preventDefault()
                      }}
                      className={`block w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 ${
                        pathname?.startsWith(`/${lang.code}`)
                          ? 'bg-[#EAF7FF] text-[#238DCA] hover:bg-[#EAF7FF]'
                          : 'text-slate-700'
                      }`}
                    >
                      {capitalize(lang.country)}
                    </button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LangSwitcher
