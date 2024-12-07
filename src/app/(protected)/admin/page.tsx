"use client"

import React, { useState } from 'react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/loading'
import Image from 'next/image'

import { ArrowLeftRight, Gauge, MessageSquareDot, Shirt, ShoppingBag } from 'lucide-react'
import Dashboard from '@/components/containers/AdminContainers/Dashboard'
import Orders from '@/components/containers/AdminContainers/Orders'
import Products from '@/components/containers/AdminContainers/Products'
import Transactions from '@/components/containers/AdminContainers/Transactions'
import Feedbacks from '@/components/containers/AdminContainers/Feedbacks'

const AdminPage = () => {
  const { data: session, status} = useSession()
  const router = useRouter();

  const [ active, setActive ] = useState('Dashboard');
  React.useEffect(() => {
    if (!session || session?.user?.role !== 'admin') {
      router.push('/')
    }
  }, [session, router])
  if (status === 'loading') return <LoadingSpinner/>

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
      icon: ArrowLeftRight,
      label: 'Transactions',
    },
    {
      icon: MessageSquareDot,
      label: 'Feedbacks',
    }
  ]

  return (
    <div className='h-dvh w-screen flex'>
      <div className='max-w-[300px] w-full h-full flex flex-col items-center p-10'>
        <Image src={'/logo.svg'} width={200} height={200} alt='logo'/>
        <div className='flex flex-col gap-5 w-full mt-10'>
          {adminNav.map((item, index) => (
              <SideBar key={index} icon={item.icon} label={item.label} active={active === item.label} 
              onClick={() => setActive(item.label)} />
            ))}
        </div>
      </div>
      <div className='bg-[#dde0e9] w-full h-full'>
        {active === 'Dashboard' && <Dashboard/>}
        {active === 'Orders' && <Orders/>}
        {active === 'Products' && <Products/>}
        {active === 'Transactions' && <Transactions/>}
        {active === 'Feedbacks' && <Feedbacks/>}
      </div>
    </div>
  )
}

const SideBar = ({ icon: Icon, label, active, onClick} : { icon: React.ElementType, label: string, active: boolean, onClick: () => void}) => {
  return (
  <>{label === 'Transactions' && <h1 className='text-zinc-500 ml-4 font-medium'>OTHERS</h1>}
    <div onClick={onClick} className={`cursor-pointer group flex items-center gap-3 p-[5px] duration-200 transition-all hover:shadow-xl ${active ? 'shadow-xl':''}`}>
      <Icon size={32} className={`p-[6px] ml-1 shadow-md rounded-md duration-200 transition-all group-hover:bg-main group-hover:text-[#f5f5f5] ${active ? 'bg-main text-[#f5f5f5]':'bg-white text-[#858585]'}`}/>
      <h1 className={`text-zinc-800 duration-200 transition-all group-hover:`}>{label}</h1>
    </div>
    </>
  )
}

export default AdminPage