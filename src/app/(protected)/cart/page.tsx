"use client"

import { useGetCartQuery } from '@/store/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { data: session, status} = useSession()
  const router = useRouter()
  
    const { data , isLoading } = useGetCartQuery(session?.user?.id, {
        skip: status !== "authenticated" || !session?.user?.id,
    });

    if(status === "loading") {
        return <LoadingSpinner/>
    }

    if(status === 'unauthenticated') {
        router.push('/')
    }
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
        <div className='flex xl:flex-row flex-col-reverse gap-5'>
            <div className='xl:w-1/2 w-full bg-[#f5f5f5] p-5 rounded-lg shadow-lg full flex flex-col'>
            <h1 className='text-xl font-semibold text-zinc-600'>Manage Your Cart</h1>
            <div className='w-full flex justify-between items-center my-5'>
                <div className='w-fit flex items-center relative'>
                    <Search size={20} className='absolute left-2 text-zinc-500'/>
                    <Input className='pl-8 rounded-full' placeholder='Search...'/>
                </div>
                <Filter size={32} className='p-[6px] bg-main text-[#f5f5f5] rounded-lg'/>
            </div>
            <div className='flex flex-col gap-3'>
            {data?.cart.map((cart) => (
                <div key={cart.id} className='flex gap-3 rounded-lg shadow-lg overflow-hidden relative w-full'>
                <Image src={'/products/mugsample1.jpg'} width={500} height={500} alt='cart image' className='w-32 object-cover'/>
                <div className='flex xl:flex-row flex-col gap-3 w-full'>
                    <div className='flex w-full xl:w-1/2 flex-col py-3'>
                        <h1 className='text-xs bg-main rounded-full w-fit px-3 py-1 text-[#f5f5f5]'>Mug</h1>
                        <h1 className='text-base lg:text-lg font-medium text-zinc-600 mt-1'>Quote Mug</h1>
                        <p className='text-xs lg:text-sm text-zinc-500 mt-2'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam aliquid provident impedit animi</p>
                    </div>
                    <div className='flex flex-col lg:flex-row xl:flex-col w-full xl:w-1/2 p-3 justify-between'>
                        <div className='flex gap-3 justify-between w-full'>
                        <div className='flex flex-col items-center'>
                            <h1 className='text-sm lg:text-md font-medium text-zinc-600'>Quantity</h1>
                            <h1 className='text-xs lg:text-sm font-light text-zinc-500'>2x</h1>
                        </div>
                        <div className='flex flex-col items-center'>
                            <h1 className='text-sm lg:text-md font-medium text-zinc-600'>Price</h1>
                            <h1 className='text-xs lg:text-sm font-light text-zinc-500'>P 120.00</h1>
                        </div>
                        <div className='flex flex-col items-center'>
                            <h1 className='text-sm lg:text-md font-medium text-zinc-600'>Total Price</h1>
                            <h1 className='text-xs lg:text-sm font-light text-zinc-500'>P 120.00</h1>
                        </div>
                        </div>
                        <div className='flex w-full gap-3 justify-end lg:mt-0 mt-3'>
                            <Button className='bg-[#f5f5f5] hover:bg-[#e2e2e2] text-zinc-800 lg:text-base text-xs'>Check Out</Button>
                            <Button className=' lg:text-sm text-xs'>Edit</Button>
                            <Button className=' lg:text-sm text-xs'>Delete</Button>
                        </div>
                    </div>
                </div>
            </div>
            ))}
            </div>
            </div>
            <div className='flex flex-col xl:w-1/2 w-full'>
                <Image src={'/cart-cover.png'} width={2500} height={2500} alt='cart cover' className='w-full object-cover rounded-lg shadow-lg'/>
            </div>
        </div>
    </div>
  )
}

export default CartPage