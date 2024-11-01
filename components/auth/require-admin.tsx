'use client'

import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  
  // Wait for the user data to load
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin'

  if (!isAdmin) {
    redirect('/')
  }

  return <>{children}</>
} 