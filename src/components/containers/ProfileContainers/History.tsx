import { Session } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { useGetUserHistoryQuery } from '@/store/api'
import { historyColumns } from '../AdminContainers/Table/columns'
import { DataTable } from '../AdminContainers/Table/data-table'
import LoadingSpinner from '@/components/ui/loading'
import { format } from 'date-fns';

const History = ({ session, status }: {session?: Session | null, status: string}) => {

  const { data, isLoading } = useGetUserHistoryQuery(session?.user.id ?? '', {
    skip: status !== "authenticated" || !session?.user?.id,
  })

  const items = data?.items || []

  const formattedItems = items.map(item => ({
    ...item,
    createdAt: format(new Date(item.createdAt), 'MMM d, yyyy'),
  }));

  return (
    <div className='flex flex-col w-full gap-5 h-full overflow-x-hidden'>
      <div className='flex justify-between w-full bg-[#f5f5f5] py-3 px-5 rounded-lg shadow-lg'>
        <div className='flex-col'>
        <div className='flex gap-3 items-center'>
          <Link href={'/'} className='text-sm text-zinc-500 hover:underline'>Home</Link>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-sm text-zinc-800 cursor-pointer hover:underline'>Profile</h1>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-sm text-zinc-800 cursor-pointer hover:underline'>History</h1>
        </div>
        <h1 className='font-semibold text-lg text-zinc-800'>History</h1>
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
      {isLoading ? (
        <LoadingSpinner fit/>
      ) : (
        <DataTable columns={historyColumns} data={formattedItems}/>
      )}
    </div>
  )
}

export default History