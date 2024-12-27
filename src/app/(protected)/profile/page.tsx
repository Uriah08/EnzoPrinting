"use client"

import React, { useState } from 'react'

import { signOut, useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/loading'
import Image from 'next/image'

import { ArrowLeftRight, ChevronLeft, LogOutIcon, ShoppingBag, User, Users} from 'lucide-react'
import Profile from '@/components/containers/ProfileContainers/Profile'
import Orders from '@/components/containers/ProfileContainers/Orders'
import History from '@/components/containers/ProfileContainers/History'

const ProfilePage = () => {
  const { data: session, status} = useSession()

  const [openSidebar, setOpenSidebar] = useState(true)

  const handleSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  const [ active, setActive ] = useState('Profile');
  if (status === 'loading') return <LoadingSpinner/>

  const adminNav = [
    {
      icon: User,
      label: 'Profile',
    },
    {
      icon: ShoppingBag,
      label: 'Orders',
    },
    {
      icon: ArrowLeftRight,
      label: 'History',
    }
  ]

  const handleNav = (set: string) => {
    setActive(set)
    setOpenSidebar(false)
  }

  const handleSignOut = () => {
        localStorage.setItem("reloaded", "false");
        signOut();
      }

  return (
    <div className='w-screen flex h-full overflow-y-auto'>
      <div className={`fixed h-full z-20 transition-all duration-500 ease-in-out ${openSidebar ? 'left-0':'-left-[294px] sm:-left-[337px]'}`}>
      <div className={`flex relative flex-col justify-between top-0 p-10 bg-[#f5f5f5] h-full`}>
        <div className='h-full flex flex-col items-center'>
          <Image src={'/logo.svg'} width={200} height={200} alt='logo' className='w-full h-[50px] sm:h-[100px]'/>
          <div className='flex flex-col gap-3 sm:gap-5 w-full mt-10'>
            {adminNav.map((item, index) => (
                <SideBar key={index} icon={item.icon} label={item.label} active={active === item.label} 
                onClick={() => handleNav(item.label)} />
              ))}
          </div>
        </div>
        <div className='flex flex-col gap-5'>
        <div onClick={handleSignOut} className={`cursor-pointer group flex items-center gap-3 p-[5px] duration-200 transition-all hover:shadow-xl`}>
          <LogOutIcon size={32} className={`p-[6px] ml-1 shadow-md rounded-md duration-200 transition-all group-hover:bg-main text-[#858585] group-hover:text-[#f5f5f5]`}/>
          <h1 className={`text-zinc-800 duration-200 transition-all text-sm sm:text-base group-hover:`}>Sign Out</h1>
        </div>
        <div className='bg-main p-3 w-full flex flex-col rounded-lg relative'>
          <button onClick={handleSidebar} className='absolute -right-[72px] cursor-pointer bg-main rounded-e-lg'>
            <ChevronLeft size={32} className={`px-[6px] text-[#f5f5f5] duration-200 transition-all rounded-e-lg ${!openSidebar ? 'rotate-180': 'rotate-0'}`}/>
          </button>
          <Users size={32} className='p-[6px] text-main bg-[#f5f5f5] rounded-sm'/>
          <h1 className='text-[#f5f5f5] font-medium mt-3'>Need Help?</h1>
          <h1 className='text-sm text-[#f5f5f5]'>lorenz08.flores@gmail.com</h1>
          <a target='_blank' href='https://mail.google.com/mail/u/0/#inbox?compose=DmwnWtDkxPZLVxkXrHRmGxnqsLbNPKqpJGKCxHSvMdJlvrrgqLCBHrFFbZqbxDjMvPfBmMgQQQwV' className='text-main text-center bg-[#f5f5f5] rounded-md mt-5 py-1 font-medium text-sm cursor-pointer'>Contact Me</a>

        </div>
        </div>
      </div>
      </div>
      <div className={`bg-[#dde0e9] w-full h-full lg:h-[100vh] overflow-y-hidden p-3 sm:p-5 ${openSidebar ? 'lg:pl-[355px]':'pl-3 sm:pl-5'} transition-all duration-500 ease-in-out`}>
        {active === 'Profile' && <Profile session={session} status={status}/>}
        {active === 'Orders' && <Orders session={session} status={status}/>}
        {active === 'History' && <History session={session} status={status}/>}
      </div>
    </div>
  )
}

const SideBar = ({ icon: Icon, label, active, onClick} : { icon: React.ElementType, label: string, active: boolean, onClick: () => void}) => {
  return (
  <>
    <div onClick={onClick} className={`cursor-pointer group flex items-center gap-3 p-[5px] duration-200 transition-all hover:shadow-xl ${active ? 'shadow-xl':''}`}>
      <Icon size={32} className={`p-[6px] ml-1 shadow-md rounded-md duration-200 transition-all group-hover:bg-main group-hover:text-[#f5f5f5] ${active ? 'bg-main text-[#f5f5f5]':'bg-white text-[#858585]'}`}/>
      <h1 className={`text-zinc-800 duration-200 transition-all text-sm sm:text-base group-hover:`}>{label}</h1>
    </div>
    </>
  )
}

export default ProfilePage