"use client"

import { Session } from 'next-auth'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { DataTable } from './Table/data-table'
import { purchaseColumns } from './Table/columns'
import { useGetItemsPurchaseQuery } from '@/store/api'
import LoadingSpinner from '@/components/ui/loading'
import { format } from 'date-fns'

type Purchase = {
  id: string;
  cartTotal: string;
  userId: string;
  createdAt: Date | string;
  status: string;
  new: boolean;
  received: boolean
  transaction: string
  user: {
      image?: string
      email: string
  }
}

const Transactions = ({ session }: {session?: Session | null}) => {

  const { data: finishedData = { items: [] }, isLoading: finishedLoading } = useGetItemsPurchaseQuery("history")
  const { data: cancelledData = { items: [] }, isLoading: cancelledLoading } = useGetItemsPurchaseQuery("cancelled")
  
  const [data, setData] = useState<Purchase[]>([])
  const [active, setActive] = useState('history')
  useEffect(() => {
    if (!finishedLoading && active === 'history') {
      const formattedData = finishedData.items.map(item => ({
        ...item,
        createdAt: format(new Date(item.createdAt), 'MMM d, yyyy'),
      }));
      setData(formattedData);
    }
  }, [finishedLoading, finishedData, active]);
  
  useEffect(() => {
    if (!cancelledLoading && active === 'cancelled') {
      const formattedData = cancelledData.items.map(item => ({
        ...item,
        createdAt: format(new Date(item.createdAt), 'MMM d, yyyy'),
      }));
      setData(formattedData);
    }
  }, [cancelledLoading, cancelledData, active])
  
  return (
    <div className='flex flex-col w-full h-[100vh] gap-3 sm:gap-5 overflow-x-hidden relative custom-scroll-bar'>
      <div className='flex justify-between w-full bg-[#f5f5f5] py-3 px-5 rounded-lg shadow-lg'>
        <div className='flex-col'>
        <div className='flex gap-1 sm:gap-3 items-center'>
          <Link href={'/'} className='text-xs sm:text-sm text-zinc-500 hover:underline'>Home</Link>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-xs sm:text-sm text-zinc-800 cursor-pointer hover:underline'>Admin</h1>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-xs sm:text-sm text-zinc-800 cursor-pointer hover:underline'>Transactions</h1>
        </div>
        <h1 className='font-semibold text-sm sm:text-lg text-zinc-800'>Transactions</h1>
        </div>
        {session && 
          <div className='cursor-pointer lg:ml-8 xl:ml-14 flex gap-5 items-center'>
          <Link href={'/profile'} className='flex gap-3'>
          <div className='flex flex-col text-end'>
                                <p className='text-base font-medium text-zinc-800 sm:block hidden'>{session.user.name}</p>
                                <p className='text-sm font-medium text-zinc-600 sm:block hidden'>{session.user.email}</p>
                            </div>
              <Image src={session.user.image ? session.user.image : '/profile.png'} width={700} height={700} alt='profile' className='size-[45px] rounded-full'/>
          </Link>
          </div>
        }
      </div>
      <div className='w-full'>
      <div className='px-5 py-3 mb-3 rounded-lg w-full shadow-lg bg-[#f5f5f5] flex gap-5'>
        <h1 onClick={() => setActive('history')} className={`w-1/2 text-center text-xl p-1 cursor-pointer font-semibold ${active === 'history' ? 'text-[#f5f5f5] bg-main rounded-lg':''} `}>Finished</h1>
        <h1 onClick={() => setActive('cancelled')} className={`w-1/2 text-center text-xl p-1 cursor-pointer font-semibold ${active === 'cancelled' ? 'text-[#f5f5f5] bg-main rounded-lg':''}`}>Cancelled</h1>
      </div>
      <div>
      {finishedLoading || cancelledLoading ? (
        <LoadingSpinner fit/>
      ) : (
        <DataTable columns={purchaseColumns} data={data}/>
      )}
      </div>
      </div>
    </div>
  )
}

export default Transactions