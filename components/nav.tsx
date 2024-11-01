'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, SignOutButton, useUser } from "@clerk/nextjs"
import { useRouter } from 'next/navigation'

export function Nav() {
  const { isSignedIn, user, isLoaded } = useUser()
  const router = useRouter()
  const isAdmin = user?.publicMetadata?.role === 'admin'

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Admin button clicked')
    router.push('/admin')
  }

  if (!isLoaded) return null

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-4">
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        ) : (
          <>
            {isAdmin && (
              <Button 
                variant="ghost" 
                onClick={handleAdminClick}
              >
                Admin Dashboard
              </Button>
            )}
            <UserButton />
            <SignOutButton>
              <Button variant="outline">Sign Out</Button>
            </SignOutButton>
          </>
        )}
      </div>
    </div>
  )
}