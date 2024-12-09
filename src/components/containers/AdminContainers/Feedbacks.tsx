"use client"

import { Session } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useGetFeedbackQuery, useDeleteFeedbackMutation, api } from '@/store/api'

import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'

const Feedbacks = ({ session }: {session?: Session | null}) => {

  const  { toast } = useToast()

  const { data, isLoading } = useGetFeedbackQuery();
  const [deleteFeedback, { isLoading: deleteLoading }] = useDeleteFeedbackMutation();
  const feedbacks = data?.feedback || [];

  const handleDelete = async (feedbackId: string) => {
    try {
     const response = await deleteFeedback(feedbackId).unwrap()

     if(!response.success){
       throw new Error(response.error|| 'Failed to delete feedback')
     }

     api.util.updateQueryData('getFeedback', undefined, (draft) => {
      draft.feedback = draft.feedback.filter(
        (feedback) => feedback.id !== feedbackId
      );
    });

    toast({
      title: 'Feedback Deleted!',
      description: 'Feedback has been deleted successfully',
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: 'Sending Feedback Failed!',
        description: error.message,
      })
    }
  };

  
  return (
    <div className='flex flex-col w-full gap-5 h-full overflow-x-hidden'>
      <div className='flex justify-between w-full bg-[#f5f5f5] py-3 px-5 rounded-lg shadow-lg'>
        <div className='flex-col'>
        <div className='flex gap-3 items-center'>
          <Link href={'/'} className='text-sm text-zinc-500 hover:underline'>Home</Link>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-sm text-zinc-800 cursor-pointer hover:underline'>Feedbacks</h1>
        </div>
        <h1 className='font-semibold text-lg text-zinc-800'>Feedbacks</h1>
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
      <div className='w-full h-full flex flex-col lg:flex-row gap-5 overflow-y-hidden'>
          <div className='lg:w-2/3 w-full max-h-[70vh] lg:max-h-[100vh] lg:h-full bg-[#f5f5f5] rounded-lg shadow-lg p-5 flex flex-col gap-5'>
          <div className='w-full flex justify-between items-center'>
          <div className='w-fit flex items-center relative'>
            <Search size={20} className='absolute left-2 text-zinc-500'/>
            <Input className='pl-8 rounded-full' placeholder='Search...'/>
            </div>
            <Filter size={32} className='p-[6px] bg-main text-[#f5f5f5] rounded-lg'/>
          </div>
          <div className='flex flex-col gap-3 mt-5 overflow-y-auto'>
            {isLoading ? (
            <>
            <div className='flex flex-col p-4 shadow-lg rounded-lg'>
              <div className='flex gap-3'>
                <Skeleton className='h-[45px] w-[45px] rounded-full'/>
                <div className='flex flex-col gap-1'>
                <Skeleton className='h-[20px] w-[180px]'/>
                <Skeleton className='h-[20px] w-[150px]'/>
                </div>
              </div>
              <Skeleton className='h-[60px] w-full mt-3'/>
            </div>
            <div className='flex flex-col p-4 shadow-lg rounded-lg'>
              <div className='flex gap-3'>
                <Skeleton className='h-[45px] w-[45px] rounded-full'/>
                <div className='flex flex-col gap-1'>
                <Skeleton className='h-[20px] w-[180px]'/>
                <Skeleton className='h-[20px] w-[150px]'/>
                </div>
              </div>
              <Skeleton className='h-[60px] w-full mt-3'/>
            </div>
            <div className='flex flex-col p-4 shadow-lg rounded-lg'>
              <div className='flex gap-3'>
                <Skeleton className='h-[45px] w-[45px] rounded-full'/>
                <div className='flex flex-col gap-1'>
                <Skeleton className='h-[20px] w-[180px]'/>
                <Skeleton className='h-[20px] w-[150px]'/>
                </div>
              </div>
              <Skeleton className='h-[60px] w-full mt-3'/>
            </div>
            <div className='flex flex-col p-4 shadow-lg rounded-lg'>
              <div className='flex gap-3'>
                <Skeleton className='h-[45px] w-[45px] rounded-full'/>
                <div className='flex flex-col gap-1'>
                <Skeleton className='h-[20px] w-[180px]'/>
                <Skeleton className='h-[20px] w-[150px]'/>
                </div>
              </div>
              <Skeleton className='h-[60px] w-full mt-3'/>
            </div>
            </>):(
              Array.isArray(feedbacks) && feedbacks.length > 0 ? (
                feedbacks?.map((feedback) => (
                  <div key={feedback.id} className='flex flex-col p-4 shadow-lg rounded-lg'>
                  <div className='flex justify-between'>
                  <div className='flex gap-3'>
                  <Image src={feedback.user.image ? feedback.user.image : '/profile.png'} width={700} height={700} alt='profile' className='size-[35px] lg:size-[45px] rounded-full'/>
                  <div className='flex flex-col'>
                    <p className='text-sm lg:text-base font-medium text-zinc-800'>{feedback.user.name}</p>
                    <p className='text-xs lg:text-sm font-medium text-zinc-600'>{feedback.user.email}</p>
                  </div>
                  </div>
                  <p className='text-xs text-zinc-500 mt-3 text-end'>January 2, 2022</p>
                  </div>
                  <h1 className='text-sm mt-3 text-zinc-600'>{feedback.feedback}
                  </h1>
                  <div className='flex gap-5 mt-3'>
                    <Button disabled={deleteLoading} onClick={() => handleDelete(feedback.id)} className='bg-red-500 hover:bg-red-600 duration-200 transition-all'>{deleteLoading ? 'Deleting...':'Delete'}</Button>
                  </div>
                </div>
                ))) : (
                    <h1 className='text-center font-bold text-2xl text-zinc-400'>No Feedback Found</h1>
                )
            )
            }
          </div>
          </div>
          <div className='lg:w-1/3 h-full lg:h-full bg-[#f5f5f5] rounded-lg shadow-lg'></div>
      </div>
    </div>
  )
}

export default Feedbacks