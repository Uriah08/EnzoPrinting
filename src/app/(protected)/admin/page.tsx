"use client"

import React from 'react'
import { signOut } from 'next-auth/react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/loading'

const AdminPage = () => {

  const { data: session, status} = useSession()

  const router = useRouter();

  React.useEffect(() => {
    if (!session || session?.user?.role !== 'admin') {
      router.push('/')
    }
  }, [session, router])

  if (status === 'loading') return <LoadingSpinner/>

  return (
    <div>
      <button type="submit" onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

export default AdminPage