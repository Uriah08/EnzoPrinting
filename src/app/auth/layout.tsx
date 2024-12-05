import Image from 'next/image'
import React from 'react'

interface Props {
    children: React.ReactNode
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className='h-dvh w-dvw flex items-center justify-center'>
        <div className='border-[1px] shadow-lg border-zinc-300 p-5 rounded-xl max-w-[400px] w-full'>
            <div className='w-full flex justify-center py-3'>
                <Image src={'/logo.svg'} width={200} height={200} alt='logo'/>
            </div>
            {children}
            <div className='mt-3 w-full relative flex justify-center'>
                <div>
                <h1 className='text-zinc-600 text-center z-20 relative px-3 bg-[#f5f5f5]'>OR CONTINUE WITH</h1>
                </div>
                <div className='w-full h-[1px] bg-zinc-600 z-10 absolute top-1/2 left-0 -translate-y-1/2'/>
            </div>
            <button className='w-full mt-3 bg-blue-500 hover:bg-blue-400 duration-200 transition-all flex items-center gap-3 p-1'>
                <div className='bg-[#f5f5f5] p-1 min-w-[48px]'>
                <Image src={'/google.png'} width={500} height={500} alt='google' className='size-[40px]'/>
                </div>
                <h1 className='text-center text-[#f5f5f5] w-full'>Sign In with Google</h1>
            </button>
        </div>
    </div>
  )
}

export default AuthLayout