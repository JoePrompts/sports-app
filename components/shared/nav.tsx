'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, SignOutButton, useUser } from "@clerk/nextjs"

export function Nav() {
  const { isSignedIn } = useUser()

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-4">
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        ) : (
          <>
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