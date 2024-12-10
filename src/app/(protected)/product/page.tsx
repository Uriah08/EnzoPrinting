"use client"

import LoadingSpinner from '@/components/ui/loading'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { ChevronDown, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ProductPage = () => {
    const { data: session, status} = useSession()
    if (status === 'loading') return <LoadingSpinner/>
    if(!session) {
        return <div className='h-dvh w-screen flex justify-center items-center text-2xl text-center font-bold text-zinc-700'>Please log in to view this page.</div>
    }
  return (
    <div className='h-dvh w-full p-5 bg-[#dde0e9] flex flex-col gap-5 overflow-y-auto'>
        <div className='bg-[#f5f5f5] py-3 px-5 rounded-lg items-center shadow-lg flex justify-between'>
            <h1 className='text-2xl font-bold text-zinc-800'>Product Page</h1>
            <div className='flex gap-5 items-center'>
                <Link href='/profile' className='cursor-pointer flex items-center gap-3'>
            <div className='flex flex-col items-end'>
                        <p className='text-base font-medium text-zinc-800'>{session.user.name}</p>
                        <p className='text-sm font-medium text-zinc-600'>{session.user.email}</p>
                    </div>
                <Image src={session.user.image ? session.user.image : '/profile.png'} width={700} height={700} alt='profile' className='size-[45px] rounded-full'/>
            </Link>
            <Link href={'/cart'} className='relative'>   
                    <ShoppingCart size={35} className='text-zinc-500'/>
                    <h1 className='bg-red-500 size-5 rounded-full top-0 absolute -right-[5px] flex items-center justify-center text-white text-xs'>2</h1>
                </Link>
            </div>
        </div>
        <div className='w-2/3 flex flex-col gap-5'>
        <Image src={'/store-cover.png'} width={1200} height={1200} alt='cover' className='rounded-lg shadow-lg w-full object-cover'/>
        <div className='w-full h-full bg-[#f5f5f5] p-5 shadow-lg rounded-lg'>
            <h1 className='text-xl font-semibold text-zinc-600'>Products</h1>
            <div className='flex justify-between mt-3'>
            <div className='flex gap-5 text-lg font-light text-zinc-400'>
                <h1>All</h1>
                <h1>Papers</h1>
                <h1>Mugs</h1>
                <h1>Shirt</h1>
                <h1>Sticker</h1>
            </div>
            <div className='flex gap-1 items-center'>
                <h1>Relevant</h1>
                <ChevronDown size={14}/>
            </div>
            </div>
            <div className='grid grid-cols-4 gap-5 mt-5'>
            <div className='flex flex-col p-3 border border-zinc-300 gap-4'>
                <Image src={'/products/mugsample1.jpg'} width={500} height={500} alt='image' className='size-72 object-cover'/>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl font-semibold'>Quote Mug</h1>
                    <h1 className='text-sm text-zinc-700'>₱ 120.00</h1>
                </div>
                <Button className='bg-main hover:bg-main2'>Inquire</Button>
            </div>
        </div>
        </div>
        </div>
    </div>
  )
}

export default ProductPage