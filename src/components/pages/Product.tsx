"use client"

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { useGetHighlightProductQuery, useGetFeedbackQuery } from '@/store/api'
import { Skeleton } from '../ui/skeleton'

const Product = () => {

    const { data: feedbackData } = useGetFeedbackQuery();
    const feedbacks = feedbackData?.feedback || [];

    const { data, isLoading } = useGetHighlightProductQuery()
    const products = data?.product || []

    const [currentIndex, setCurrentIndex] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleNext = () => {
        stopAutoplay();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbacks.length);
    };

    const handlePrev = () => {
        stopAutoplay();
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? feedbacks.length - 1 : prevIndex - 1
        );
    };

    const stopAutoplay = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbacks.length);
        }, 5000);

        return () => stopAutoplay();
    }, [feedbacks.length]);

    const { user, feedback } = feedbacks[currentIndex] || {};
    const { name, image } = user || {};

  return (
    <section id='product' className='bg-white h-full w-full flex flex-col items-center justify-center'>
        <h1 className='text-center text-2xl pt-20 w-full'>Products</h1>
        <div className='max-w-[1200px] w-full h-full p-3 sm:p-10'>
            {/* <Image src={"/logo.svg"} width={200} height={200} alt='logo' className='place-self-center'/>
            <div className='flex w-full justify-center mt-5'>
                <Link href={'/product'} className='bg-main duration-200 transition-all hover:bg-main2 text-white px-5 py-2 rounded-lg'>View All</Link>
            </div> */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 rounded-sm overflow-hidden'>
                {isLoading ? (
                    <>
                    <Skeleton className='w-full h-[300px]'/>
                    <Skeleton className='w-full h-[300px]'/>
                    <Skeleton className='w-full h-[300px]'/>
                    <Skeleton className='w-full h-[300px]'/>
                    </>
                    
                ) : (
                    products.map((product) => (
                        <div key={product.id} className='bg-[#f3f3f3] w-full flex'>
                        <div className='w-1/2'>
                        <Image src={product.image} width={500} height={500} alt='logo' className='max-h-[300px] h-full object-cover'/>
                        </div>
                        <div className='w-1/2 flex flex-col justify-between p-3 h-full'>
                        <div className='flex flex-col w-full'>
                        <h1 className='text-base sm:text-xl font-semibold'>
                                {product.name}
                            </h1>
                            <h2 className='bg-main px-2 sm:px-3 py-1 rounded-xl w-fit text-white sm:text-base text-xs font-light mt-2'>
                            {product.category}
                            </h2>
                            <p className='text-xs sm:text-sm text-zinc-600 font-light text-justify mt-5'>{product.description}</p>
                        </div>
                            <Link href={'/product'} className='w-full'>
                            <Button className='bg-main rounded-xl sm:text-sm text-xs mt-5 font-light duration-200 transition-all hover:bg-main2 w-full'>
                                Inquire
                            </Button>
                            </Link>
                        </div>
                    </div>
                    ))
                )}
            </div>
        </div>
        <a className='text-[#f3f3f3] bg-main py-2 px-3 sm:px-4 sm:text-base text-xs rounded-full duration-200 transition-all hover:bg-main2 cursor-pointer'>View More Products</a>
        <div className='max-w-[1200px] flex flex-col w-full h-full sm:p-10 mb-20'>
            <h1 className='text-lg sm:text-2xl font-semibold px-3 text-center mt-10'><span className='text-main'>Dedicated Testimonials</span> from our Customers.</h1>
            <div className='flex flex-col'>
                <div className='bg-main p-3 sm:p-5 overflow-y-hidden mt-10 relative flex justify-center w-full'>
                <Image src={"/quote.svg"} width={50} height={50} alt='side' className='absolute right-[10%]'/>
                    <Image src={"/sidepic1.svg"} width={200} height={200} alt='side' className='absolute left-[20%]'/>
                    <div className='w-full flex flex-col items-center z-10'>
                    <Image src={image || '/profile.png'} width={50} height={50} alt='profile' className='rounded-full w-[50px] h-[50px]'/>
                    <h1 className='text-[#f4f4f4] font-semibold mt-3'>{name}</h1>
                    <h2 className='text-[#eeeeee] sm:text-base text-sm'>Customer</h2>
                    <p className='text-xs sm:text-sm px-10 text-[#f4f4f4] font-light text-center mt-5 w-full max-w-[800px]'>
                        &quot;{feedback}&quot;
                    </p>
                    <div className='flex w-full justify-between absolute top-1/2 -translate-y-1/2'>
                        <ChevronLeft onClick={handlePrev} className='text-[#f4f4f4] cursor-pointer' size={40}/>
                        <ChevronRight onClick={handleNext} className='text-[#f4f4f4] cursor-pointer' size={40}/>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}

export default Product