import { Session } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Album, ShoppingBag, HandCoins, ReceiptText, LogOut } from 'lucide-react'
import { WaveChart } from '@/components/charts/wave-chart'
import { signOut } from 'next-auth/react'

const Profile = ({ session }: {session?: Session | null}) => {


    const handleSignOut = () => {
      localStorage.setItem("reloaded", "false");
      signOut();
    }

  return (
    <div className='flex flex-col w-full gap-5 h-full overflow-x-hidden'>
      <div className='flex justify-between w-full bg-[#f5f5f5] py-3 px-5 rounded-lg shadow-lg'>
        <div className='flex-col'>
        <div className='flex gap-3 items-center'>
          <Link href={'/'} className='text-sm text-zinc-500 hover:underline'>Home</Link>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-sm text-zinc-800 cursor-pointer hover:underline'>Profile</h1>
        </div>
        <h1 className='font-semibold text-lg text-zinc-800'>{session?.user.name ? session.user.name.split(' ')[0][0].toUpperCase() + session.user.name.split(' ')[0].slice(1).toLowerCase() : ''}&apos;s Profile</h1>
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
      <div className='w-full lg:h-full flex flex-col-reverse lg:flex-row gap-5 overflow-y-hidden'>
        <div className='lg:w-2/3 h-[100vh] lg:h-full w-full bg-[#f5f5f5] rounded-lg shadow-lg p-5 flex flex-col gap-5'>
        <WaveChart/>
        <div className='flex gap-5 overflow-x-auto custom-scroll-bar2'>
          <div className='bg-main bg-opacity-10 p-5 rounded-xl flex flex-col gap-5 max-w-60 w-full'>
            <h1 className='text-main text-xl font-semibold'>Everything you need, printed to perfection.</h1>
          </div>
          <div className='bg-follow bg-opacity-10 p-5 rounded-xl flex flex-col gap-5 max-w-60 w-full'>
            <h1 className='text-follow text-xl font-semibold'>Everything you need, printed to perfection.</h1>
          </div>
          <div className='bg-myYellow bg-opacity-10 p-5 rounded-xl flex flex-col gap-5 max-w-60 w-full'>
            <h1 className='text-myYellow text-xl font-semibold'>Everything you need, printed to perfection.</h1>
          </div>
          <div className='bg-main bg-opacity-10 p-5 rounded-xl flex flex-col gap-5 max-w-60 w-full'>
            <h1 className='text-main text-xl font-semibold'>Everything you need, printed to perfection.</h1>
          </div>
          <div className='bg-follow bg-opacity-10 p-5 rounded-xl flex flex-col gap-5 max-w-60 w-full'>
            <h1 className='text-follow text-xl font-semibold'>Everything you need, printed to perfection.</h1>
          </div>
          <div className='bg-myYellow bg-opacity-10 p-5 rounded-xl flex flex-col gap-5 max-w-60 w-full'>
            <h1 className='text-myYellow text-xl font-semibold'>Everything you need, printed to perfection.</h1>
          </div>
        </div>
        <div className='flex lg:flex-row flex-col gap-5 w-full'>
          <div className='lg:w-1/2 w-full flex flex-col'>
          <div className='flex justify-between items-center'>
            <div className='flex flex-col'>
            <h1 className='text-zinc-800 text-lg font-semibold'>Browse History</h1>
            <p className='text-sm text-zinc-400'>View your order history</p>
            </div>
          <h1 className='bg-main px-2 py-1 rounded-md text-[#f5f5f5]'>See All...</h1>
          </div>
          <div></div>
          </div>
          <div className='lg:w-1/2 w-full flex flex-col'>
          <div className='flex justify-between items-center'>
            <div className='flex flex-col'>
            <h1 className='text-zinc-800 text-lg font-semibold'>Browse History</h1>
            <p className='text-sm text-zinc-400'>View your order history</p>
            </div>
          <h1 className='bg-main px-2 py-1 rounded-md text-[#f5f5f5]'>See All...</h1>
          </div>
          <div></div>
          </div>
        </div>
        </div>
        <div className='lg:w-1/3 overflow-hidden h-full bg-[#f5f5f5] rounded-lg shadow-lg p-5 flex flex-col justify-between'>
        <div className='flex flex-col'>
        <div className='flex gap-5 w-full'>
        <Image src={session?.user?.image || '/profile.png'} width={500} height={500} alt='profile' className='size-20 rounded-full'/>
        <div className='flex flex-col justify-between'>
          <h1 className='bg-main px-2 py-1 text-xs rounded-lg text-[#f5f5f5] w-fit'>{session?.user.role}</h1>
          <div className='flex flex-col'>
          <h1 className='text-2xl font-semibold text-zinc-800'>{session?.user.name}</h1>
          <h1 className='text-zinc-500'>{session?.user.email}</h1>
          </div>
        </div>
        </div>
          <div className='grid grid-cols-1 xl:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-5 w-full mt-20'>
            <Tags icon={Album} label={"Browsed Items"}/>
            <Tags icon={ReceiptText} label={"Order Count"}/>
            <Tags icon={ShoppingBag} label={"Your Orders"}/>
            <Tags icon={HandCoins} label={"Total Purchase"}/>
          </div>
        </div>
          <div className='self-end'>
          <button onClick={handleSignOut} className='flex items-center gap-3 text-zinc-500 font-semibold'>Sign Out <LogOut className='size-8 text-zinc-400'/></button>
        </div>
        </div>
      </div>
    </div>
  )
}

const Tags = ({ label, icon: Icon }: { label: string, icon: React.ElementType }) => {
  return (
    <div className='bg-main w-full p-5 rounded-lg flex flex-col gap-5'>
      <div className='flex gap-3 items-center'>
        <Icon size={32} className='p-[6px] ml-1 shadow-md rounded-md bg-white text-main' />
        <h1 className='text-[#f5f5f5] text-xl font-semibold'>{label}</h1>
      </div>
      <div className='w-full'>
        <h1 style={{ fontSize: "20px" }} className='font-bold text-[#f5f5f5]'>1233</h1>
      </div>
    </div>
  );
}

export default Profile