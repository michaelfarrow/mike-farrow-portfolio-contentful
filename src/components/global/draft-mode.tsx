'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

export default function DraftMode(props: React.ComponentPropsWithoutRef<'a'>) {
  const pathname = usePathname()

  return (
    <a href={`/api/exit-preview?redirect=${pathname}`} {...props}>
      Exit
    </a>
  )
}
