"use client"

import LoadingSpinner from '@/components/ui/loading'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGetProductQuery } from '@/store/api'
import { Skeleton } from '@/components/ui/skeleton'

const ProductPage = () => {

    const [active, setActive] = useState('All')

    const productNav = [
        {label: 'All'},{label: 'Paper'},{label: 'Book'},{label: 'Mug'},{label: 'Shirt'},{label: 'ID'},{label: 'Keychain'},{label: 'Sticker'},{label: 'Other'}
    ]

    const { data, isLoading } = useGetProductQuery();
    
    const products = data?.product || []
    
    const { data: session, status} = useSession()
    if (status === 'loading') return <LoadingSpinner/>
  return (
    <div className='min-h-[100dvh] w-full p-5 bg-[#dde0e9] flex flex-col gap-5 overflow-y-auto'>
        <div className='bg-[#f5f5f5] py-3 px-5 rounded-lg items-center shadow-lg flex justify-between'>
            <h1 className='text-xl sm:text-2xl font-bold text-zinc-800'>Product Page</h1>

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
            )}
        </div>
        <div className='lg:w-2/3 w-full flex flex-col gap-5'>
        <Image src={'/store-cover.png'} width={1200} height={1200} alt='cover' className='rounded-lg shadow-lg w-full object-cover'/>
        <div className='w-full bg-[#f5f5f5] p-5 shadow-lg rounded-lg relative min-h-[40vh]'>
            <h1 className='text-xl font-semibold text-zinc-600'>Products</h1>
            <div className='flex gap-x-2 gap-y-1 sm:gap-x-3 mt-5 flex-wrap'>
                {productNav.map((nav) => (
                    <h1 key={nav.label} onClick={() => setActive(nav.label)} className={`text-sm lg:text-lg font-light cursor-pointer px-3 sm:px-5 py-1 rounded-sm ${active === nav.label ? 'text-[#f5f5f5] bg-main':'text-zinc-400'}`}>{nav.label}</h1>
                ))}
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 mt-5'>
                {isLoading ? (
                    <>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    </>
                ) : (
                    products.length === 0 ? (
                        <div className='absolute flex items-center justify-center text-2xl font-semibold text-zinc-500 w-full'>No Products Found</div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className='flex flex-col p-3 border border-zinc-300 gap-4'>
                                <Image src={product.image} width={500} height={500} alt='image' className='h-20 lg:h-72 sm:h-32 object-cover w-full object-center'/>
                                <h1 className='px-2 py-1 rounded-full bg-main text-[#f5f5f5] text-xs w-fit'>{product.category}</h1>
                                <div className='flex justify-between items-center'>
                                    <h1 className='text-xs lg:text-xl font-semibold'>{product.name}</h1>
                                    <h1 className='text-xs lg:text-sm text-zinc-700'>₱ {product.price}.00</h1>
                                </div>
                                <Button className='bg-main hover:bg-main2'>Inquire</Button>
                            </div>
                        ))
                    )
                )}
        </div>
        </div>
        </div>
    </div>
  );
}

export default ProductPage