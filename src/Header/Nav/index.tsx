'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { useUserContext } from '@/context/UserContext'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  const { currentUser } = useUserContext()

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
      {!currentUser ? (
        <Link className={buttonVariants({})} href={'/login'}>
          Login
        </Link>
      ) : (
        <div className="font-medium text-sm text-primary">Hello, {currentUser.name}</div>
      )}
    </nav>
  )
}
