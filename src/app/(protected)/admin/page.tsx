"use client"

import React, { useState, useEffect } from 'react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/loading'
import Image from 'next/image'

import { ArrowLeftRight, ChevronLeft, Gauge, MessageSquareDot, ScrollText, Shirt, ShoppingBag, Users } from 'lucide-react'
import Dashboard from '@/components/containers/AdminContainers/Dashboard'
import Orders from '@/components/containers/AdminContainers/Orders'
import Products from '@/components/containers/AdminContainers/Products'
import Transactions from '@/components/containers/AdminContainers/Transactions'
import Feedbacks from '@/components/containers/AdminContainers/Feedbacks'
import Quotes from '@/components/containers/AdminContainers/Quotes'

const AdminPage = () => {
  const { data: session, status} = useSession()
  const router = useRouter();

  const [openSidebar, setOpenSidebar] = useState(true)
  const [loading, setLoading] = useState(true);

  const handleSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  const [ active, setActive ] = useState('Dashboard');
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        router.push("/");
      } else {
        setLoading(false);
      }
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, session, router]);
  if (loading) return <LoadingSpinner/>

  const adminNav = [
    {
      icon: Gauge,
      label: 'Dashboard',
    },
    {
      icon: ShoppingBag,
      label: 'Orders',
    },
    {
      icon: Shirt,
      label: 'Products',
    },
    {
      icon: ScrollText,
      label: 'Quotes',
    },
    {
      icon: ArrowLeftRight,
      label: 'Transactions',
    },
    {
      icon: MessageSquareDot,
      label: 'Feedbacks',
    }
  ]

  const handleNav = (set: string) => {
    setActive(set)
    setOpenSidebar(false)
  }

  return (
    <div className='h-full w-screen flex overflow-y-auto'>
      <div className={`fixed h-full z-[9999] transition-all duration-500 ease-in-out ${openSidebar ? 'left-0':'-left-[286px] sm:-left-[336px]'}`}>
      <div className={`flex relative flex-col justify-between top-0 p-10 bg-[#f5f5f5] h-full`}>
        <div className='h-full flex flex-col items-center'>
          <Image src={'/logo.svg'} width={200} height={200} alt='logo' className='w-full h-[50px] sm:h-[100px]'/>
          <div className='flex flex-col gap-3 sm:gap-5 w-full mt-5 sm:mt-10'>
            {adminNav.map((item, index) => (
                <SideBar key={index} icon={item.icon} label={item.label} active={active === item.label} 
                onClick={() => handleNav(item.label)} />
              ))}
          </div>
        </div>
        <div className='bg-main p-2 sm:p-3 w-full flex flex-col rounded-lg relative'>
          <button onClick={handleSidebar} className='absolute -right-[72px] cursor-pointer bg-main rounded-e-lg'>
            <ChevronLeft size={32} className={`px-[6px] text-[#f5f5f5] duration-200 transition-all rounded-e-lg ${!openSidebar ? 'rotate-180': 'rotate-0'}`}/>
          </button>
          <Users size={32} className='p-[6px] text-main bg-[#f5f5f5] rounded-sm'/>
          <h1 className='text-[#f5f5f5] font-medium mt-3'>Need Help?</h1>
          <h1 className='text-sm text-[#f5f5f5]'>lorenz08.flores@gmail.com</h1>
          <button className='text-main bg-[#f5f5f5] rounded-md mt-5 py-1 font-medium text-sm'>Contact Me</button>
        </div>
      </div>
      </div>
      <div className={`bg-[#dde0e9] w-full h-full lg:h-[100vh] overflow-y-hidden p-3 sm:p-5 ${openSidebar ? 'lg:pl-[355px]':'pl-3 sm:pl-5'} transition-all duration-500 ease-in-out`}>
        {active === 'Dashboard' && <Dashboard session={session}/>}
        {active === 'Orders' && <Orders session={session}/>}
        {active === 'Products' && <Products session={session}/>}
        {active === 'Quotes' && <Quotes session={session}/>}
        {active === 'Transactions' && <Transactions session={session}/>}
        {active === 'Feedbacks' && <Feedbacks session={session}/>}
      </div>
    </div>
  )
}

const SideBar = ({ icon: Icon, label, active, onClick} : { icon: React.ElementType, label: string, active: boolean, onClick: () => void}) => {
  return (
  <>{label === 'Transactions' && <h1 className='text-zinc-500 ml-4 font-medium sm:text-base text-xs'>OTHERS</h1>}
    <div onClick={onClick} className={`cursor-pointer group flex items-center gap-3 p-[5px] duration-200 transition-all hover:shadow-xl ${active ? 'shadow-xl':''}`}>
      <Icon size={32} className={`p-[6px] ml-1 shadow-md rounded-md duration-200 transition-all group-hover:bg-main group-hover:text-[#f5f5f5] ${active ? 'bg-main text-[#f5f5f5]':'bg-white text-[#858585]'}`}/>
      <h1 className={`text-zinc-800 duration-200 transition-all sm:text-base text-sm group-hover:`}>{label}</h1>
    </div>
    </>
  )
}

export default AdminPage;