'use client'

import { FiPrinter } from 'react-icons/fi'

export function PrintButton({ label = 'Imprimer' }: { label?: string }) {
  return (
    <button
      type='button'
      onClick={() => window.print()}
      className='inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#35AEEF] px-4 text-sm font-semibold text-white transition hover:bg-[#238DCA] sm:w-auto print:hidden'
    >
      <FiPrinter aria-hidden='true' />
      {label}
    </button>
  )
}
