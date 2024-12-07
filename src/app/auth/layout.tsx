"use client"

import Image from 'next/image'
import React from 'react'

import { ChevronLeft } from 'lucide-react'

import { signIn } from 'next-auth/react'
import Link from 'next/link'

interface Props {
    children: React.ReactNode
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className='h-dvh w-dvw flex items-center justify-center'>
        <div className='border-[1px] shadow-lg border-zinc-300 p-5 sm:rounded-xl sm:max-w-[400px] w-full relative overflow-hidden'>
            <Link href={'/'} className='bg-main duration-200 transition-all hover:bg-main2 px-3 py-2 absolute left-0 top-0 rounded-br-lg'>
                <ChevronLeft size={20} className='text-white'/>
            </Link>
            <div className='w-full flex justify-center py-3 mb-5'>
                <Image src={'/logo.svg'} width={200} height={200} alt='logo'/>
            </div>
            {children}
            <div className='mt-5 w-full relative flex justify-center'>
                <div>
                <h1 className='text-zinc-500 text-center z-20 relative px-3 bg-[#f5f5f5]'>OR CONTINUE WITH</h1>
                </div>
                <div className='w-full h-[1px] bg-zinc-500 z-10 absolute top-1/2 left-0 -translate-y-1/2'/>
            </div>
            <button onClick={() => {
                signIn('google', {
                    callbackUrl: '/admin'
                })
            }} className='w-full mt-5 bg-main hover:bg-main2 duration-200 transition-all flex items-center gap-3 p-1'>
                <div className='bg-[#f5f5f5] p-1 min-w-[48px]'>
                <Image src={'/google.png'} width={500} height={500} alt='google' className='size-[40px]'/>
                </div>
                <h1 className='text-center text-[#f5f5f5] w-full'>Sign In with Google</h1>
            </button>
        </div>
    </div>
  )
}

export default AuthLayout