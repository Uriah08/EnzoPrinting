import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const GetProduct = () => {
  return (
    <div className='flex flex-col w-full gap-3 overflow-y-auto h-full'>
        <div className='flex flex-col justify-between'>
        <div className='flex p-3 gap-3 shadow-lg rounded-lg'>
            <Image src={'/products/mugsample1.jpg'} width={500} height={500} alt='product image' className='size-40'/>
            <div className='flex flex-col w-full h-full justify-between'>
                <div className='flex-col gap-3 flex'>
                <h1 className='text-lg font-semibold text-zinc-700'>Quote Mug</h1>
                <h1 className='px-3 py-1 bg-main rounded-lg text-[#f5f5f5] text-sm w-fit'>Mug</h1>
                <p className='text-sm text-zinc-500'>Start your day with a sip of joy! Our premium ceramic mug is the perfect companion for your favorite hot or cold beverages. Designed with a comfortable grip and a smooth, glossy finish, it’s both stylish and durable.
                </p>
                </div>
                <div className='flex justify-between items-center font-semibold text-sm text-zinc-800'>
                    <h1>Price: ₱120.00</h1>
                    <div className='flex gap-3'>
                        <Button className='bg-main hover:bg-main2'>Edit</Button>
                        <Button className='bg-red-500 hover:bg-red-600'>Delete</Button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default GetProduct