"use client"

import React from 'react'
import { signOut } from 'next-auth/react'

import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/loading'

const ProfilePage = () => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status} = useSession()
  if (status === 'loading') return <LoadingSpinner/>
  return (
    <div>
      <button type="submit" onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

export default ProfilePage