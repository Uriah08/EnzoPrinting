import { Session } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import ProductForm from '../Products/ProductForm'

const Products = ({ session }: {session?: Session | null}) => {
  return (
    <div className='flex flex-col w-full gap-5 h-full overflow-x-hidden'>
      <div className='flex justify-between w-full bg-[#f5f5f5] py-3 px-5 rounded-lg shadow-lg'>
        <div className='flex-col'>
        <div className='flex gap-3 items-center'>
          <Link href={'/'} className='text-sm text-zinc-500 hover:underline'>Home</Link>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-sm text-zinc-800 cursor-pointer hover:underline'>Products</h1>
        </div>
        <h1 className='font-semibold text-lg text-zinc-800'>Products</h1>
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
      <div className='w-full h-full flex flex-col-reverse xl:flex-row gap-5 overflow-y-hidden'>
        <div className='xl:w-2/3 w-full max-h-[70vh] xl:max-h-[100vh] lg:h-full bg-[#f5f5f5] rounded-lg shadow-lg p-5 flex flex-col gap-5'>
        </div>
        <div className='xl:w-1/3 h-full xl:h-full p-5 bg-[#f5f5f5] rounded-lg shadow-lg flex flex-col'>
          <div className='flex justify-between items-center gap-3'>
          <h1 className='text-base font-semibold text-zinc-700'>Manage Products</h1>
          <Dialog>
            <DialogTrigger asChild>
            <Button className='bg-main hover:bg-main2'>Create Product</Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
              <DialogTitle>
                Create Product
              </DialogTitle>
              <ProductForm/>
            </DialogContent>
          </Dialog>
          </div>
          </div>
        </div>
    </div>
  )
}

export default Products