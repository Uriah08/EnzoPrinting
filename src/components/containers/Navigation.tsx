"use client"

import { Popover, PopoverClose } from '@radix-ui/react-popover'
import Image from 'next/image'
import React from 'react'
import { PopoverContent, PopoverTrigger } from '../ui/popover'
import Link from 'next/link'
import { Session } from 'next-auth'

const Navigation = ({session}:{session?: Session | null}) => {

    const [selected, setSelected] = React.useState('home')

  return (
    <div className='absolute top-0 p-5 left-1/2 transform -translate-x-1/2 w-full max-w-[1400px] flex justify-between items-center'>
        <Image src={"/logo.svg"} width={150} height={150} alt='logo'/>
        <div className='lg:flex gap-10 font-light hidden '>
            <a href='#home' onClick={() => setSelected("home")} className={`hover:text-main duration-200 transition-all cursor-pointer ${selected === 'home' ? "text-main":""}`}>HOME</a>
            <a href='#about' onClick={() => setSelected("home")} className={`hover:text-main duration-200 transition-all cursor-pointer ${selected === 'about' ? "text-main":""}`}>ABOUT</a>
            <a href='#service' onClick={() => setSelected("home")} className={`hover:text-main duration-200 transition-all cursor-pointer ${selected === 'service' ? "text-main":""}`}>SERVICES</a>
            <a href='#product' onClick={() => setSelected("home")} className={`hover:text-main duration-200 transition-all cursor-pointer ${selected === 'product' ? "text-main":""}`}>PRODUCT</a>
            <a href='#contact' onClick={() => setSelected("home")} className={`hover:text-main duration-200 transition-all cursor-pointer ${selected === 'contact' ? "text-main":""}`}>CONTACT</a>
            {session?.user.role === 'admin' ? <Link href='/admin' className={`hover:text-main duration-200 transition-all cursor-pointer`}>ADMIN</Link> : null}
        </div>
        <div className='lg:flex gap-3 items-center hidden'>
        {session ? (
            <Link href='/profile' className='cursor-pointer'>
                <Image src={session.user.image ? session.user.image : '/profile.png'} width={700} height={700} alt='profile' className='size-[45px] rounded-full'/>
            </Link>
        ):(
            <Link href={'/auth/sign-in'} className='cursor-pointer'>
            <button className='tracking-widest py-2 px-10 bg-main rounded-full duration-200 transition-all hover:bg-main2 font-medium text-[#f3f3f3]'>
                LOGIN
            </button>
            </Link>
        )}
        </div>
        <Popover>
            <PopoverTrigger asChild>
                <div className='lg:hidden cursor-pointer p-5 border-gray-500'>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
                </div>
            </PopoverTrigger>
            <PopoverContent align='end' className='lg:hidden'>
                <div className='flex flex-col gap-3'>
                    <PopoverClose className='flex flex-col gap-3 focus:border-none'>
                    <a href='#home' onClick={() => setSelected("home")} className={`cursor-pointer ${selected === 'home' ? "text-main":""}`}>HOME</a>
                    <a href='#about' onClick={() => setSelected("home")} className={`cursor-pointer ${selected === 'about' ? "text-main":""}`}>ABOUT</a>
                    <a href='#service' onClick={() => setSelected("home")} className={`cursor-pointer ${selected === 'service' ? "text-main":""}`}>SERVICES</a>
                    <a href='#product' onClick={() => setSelected("home")} className={`cursor-pointer ${selected === 'product' ? "text-main":""}`}>PRODUCT</a>
                    <a href='#contact' onClick={() => setSelected("home")} className={`cursor-pointer ${selected === 'contact' ? "text-main":""}`}>CONTACT</a>
                    </PopoverClose>
                    {session ? (
                        <Link href='/profile' className='cursor-pointer flex items-center gap-3 mt-3'>
                            <Image src={session.user.image ? session.user.image : '/profile.png'} width={700} height={700} alt='profile' className='size-[45px] rounded-full'/>
                            <div className='flex flex-col'>
                                <p className='text-base font-medium text-zinc-800'>{session.user.name}</p>
                                <p className='text-sm font-medium text-zinc-600'>{session.user.email}</p>
                            </div>
                        </Link>
                    ):(
                        <Link href={'/auth/sign-in'} className='cursor-pointer mt-3'>
                        <button className='tracking-widest w-full py-2 px-4 bg-main rounded-full duration-200 transition-all hover:bg-main2 font-medium text-[#f3f3f3]'>
                            LOGIN
                        </button>
                        </Link>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    </div>  
  );
}

export default Navigation