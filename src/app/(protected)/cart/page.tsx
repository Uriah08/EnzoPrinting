"use client"

import { useGetCartQuery } from '@/store/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';

const CartPage = () => {
  const { data: session, status} = useSession()
  
      const { data , isLoading } = useGetCartQuery(session?.user?.id, {
          skip: status !== "authenticated" || !session?.user?.id,
        });
  return (
    <div className='min-h-[100dvh] w-full p-5 bg-[#dde0e9] flex flex-col gap-5 overflow-y-auto'>
      <div className='bg-[#f5f5f5] py-3 px-5 rounded-lg items-center shadow-lg flex justify-between'>
            <h1 className='text-xl sm:text-2xl font-bold text-zinc-800'>Your Cart</h1>

            {!session ? (
                <Link href={'/auth/sign-in'} className='cursor-pointer'>
                <button className='tracking-widest py-2 px-10 bg-main rounded-full duration-200 transition-all hover:bg-main2 font-medium text-[#f3f3f3]'>
                    LOGIN
                </button>
                </Link>
            ) : (
                <div className='flex gap-5 items-center'>
                <Link href='/profile' className='cursor-pointer flex items-center gap-3'>
            <div className='flex flex-col items-end'>
                        <p className='text-base font-medium text-zinc-800 hidden sm:block'>{session.user.name}</p>
                        <p className='text-sm font-medium text-zinc-600 hidden sm:block'>{session.user.email}</p>
                    </div>
                <Image src={session.user.image ? session.user.image : '/profile.png'} width={700} height={700} alt='profile' className='size-[45px] rounded-full'/>
            </Link>
            </div>
            )}
        </div>
    </div>
  )
}

export default CartPage