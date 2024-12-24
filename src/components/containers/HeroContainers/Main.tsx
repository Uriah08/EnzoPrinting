import Image from 'next/image'
import React from 'react'
import { DemoCardsDrag } from './DragImages';
import QuoteModal from './QuoteModal';

const Main = () => {
  return (
    <div className='h-full w-full pb-60 px-5 lg:px-0 flex justify-center mt-48 relative overflow-hidden'>
        <div className='flex flex-col items-center h-full z-50'>
            <h1 className='text-xl sm:text-3xl'>You’re printing bro!</h1>
            <SvgPattern/>
            <h1 className='text-xl sm:text-3xl -mt-1 sm:mt-0 text-center'>Your One-Stop Printing Solution!</h1>
            <p className='font-light mt-5 sm:mt-10 max-w-[350px] text-sm sm:text-base text-center'>
                Welcome to ENZO your one stop solution
                for all your printing needs.
            </p>
            <QuoteModal/>
          <DemoCardsDrag/>
        </div>
        <div className='z-40 hidden absolute w-full lg:flex justify-between items-end mt-48'>
            <Image src={"/paper-optimized.svg"} width={160} height={300} alt='product' className='clip-shadow lg:w-[120px] xl:w-[160px]'/>
            <Image src={"/mug-optimized.svg"} width={300} height={300} alt='product' className='clip-shadow lg:w-[200px] xl:w-[330px]'/>
            <Image src={"/box-optimized.svg"} width={100} height={300} alt='product' className='clip-shadow lg:w-[50px] xl:w-[100px]'/>
            <Image src={"/keychain-optimized.svg"} width={200} height={300} alt='product' className='clip-shadow lg:w-[100px] xl:w-[200px]'/>
            <Image src={"/optimized-shirt-compressed.svg"} width={300} height={200} alt='product' className='clip-shadow lg:w-[200px] xl:w-[300px]'/>
            <Image src={"/box2-optimized.svg"} width={180} height={300} alt='product' className='clip-shadow lg:w-[150px] xl:w-[180px]'/>
        </div>
    </div>
  )
}

function SvgPattern() {
    return (
      <svg width="37" height="8" viewBox="0 0 37 8" fill="#1A90F1">
        <path
          d="M1 5.39971C7.48565 -1.08593 6.44837 -0.12827 8.33643 6.47992C8.34809 6.52075 11.6019 2.72875 12.3422 2.33912C13.8991 1.5197 16.6594 2.96924 18.3734 2.96924C21.665 2.96924 23.1972 1.69759 26.745 2.78921C29.7551 3.71539 32.6954 3.7794 35.8368 3.7794"
          stroke="#1A90F1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

export default Main