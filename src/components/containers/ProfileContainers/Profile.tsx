import { Session } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const Profile = ({ session }: {session?: Session | null}) => {
  return (
    <div className='flex flex-col w-full gap-5 h-full overflow-x-hidden'>
      <div className='flex justify-between w-full bg-[#f5f5f5] py-3 px-5 rounded-lg shadow-lg'>
        <div className='flex-col'>
        <div className='flex gap-3 items-center'>
          <Link href={'/'} className='text-sm text-zinc-500 hover:underline'>Home</Link>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-sm text-zinc-800 cursor-pointer hover:underline'>Profile</h1>
        </div>
        <h1 className='font-semibold text-lg text-zinc-800'>Profile</h1>
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
      <div className='flex gap-5 w-full h-full'>
        <div className='w-2/3 bg-[#f5f5f5] p-5 rounded-lg shadow-lg h-full'></div>
        <div className='w-1/3 bg-[#f5f5f5] px-5 py-10 rounded-lg shadow-lg h-full flex flex-col items-center'>
          <Image src={session?.user?.image || '/profile.png'} width={500} height={500} alt='profile' className='size-20 rounded-full mx-auto'/>
          <h1 className='text-2xl font-semibold text-zinc-800 mt-5'>{session?.user.name}</h1>
          <h1 className='text-zinc-500'>{session?.user.email}</h1>
        </div>
      </div>
    </div>
  )
}

export default Profile