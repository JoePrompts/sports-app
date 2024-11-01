'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-4 mb-4">
      <Link
        href="/"
        className={cn(
          "px-4 py-2 rounded-md",
          pathname === "/" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
      >
        Home
      </Link>
      <Link
        href="/admin"
        className={cn(
          "px-4 py-2 rounded-md",
          pathname === "/admin" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
      >
        Admin
      </Link>
    </nav>
  )
} 