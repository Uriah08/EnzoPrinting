import { Session } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { useGetUserOrderQuery, useUpdateOrderReceivedMutation } from '@/store/api'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageCircle } from 'lucide-react'
import { PieCharts } from '@/components/charts/profile-orders'

const Orders = ({ session, status }: {session?: Session | null, status: string}) => {

  const { toast } = useToast()

  const { data, isLoading: userOrderLoading } = useGetUserOrderQuery(session?.user?.id ?? '', {
    skip: status !== "authenticated" || !session?.user?.id,
  })

  const [updateOrderReceived, { isLoading: orderReceived}] = useUpdateOrderReceivedMutation()

  const items = data?.items || []

  console.log(items);

  const handleReceivedUpdate = async (id: string) => {
    console.log(id)
    try {
      const response = await updateOrderReceived(id).unwrap()
      if(!response.success) {
        throw new Error(response.message || 'Unknown Error Occured')
      }
      toast({
        title: 'You received the item',
        description: 'Order marked as received'
      })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (error: any) {
      toast({
        title: 'Update Failed!',
        description: error.data.message
      })
    }
  }
  

  return (
    <div className='flex flex-col w-full gap-5 h-full overflow-hidden'>
      <div className='flex justify-between w-full bg-[#f5f5f5] py-3 px-5 rounded-lg shadow-lg'>
        <div className='flex-col'>
        <div className='flex gap-3 items-center'>
          <Link href={'/'} className='text-sm text-zinc-500 hover:underline'>Home</Link>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-sm text-zinc-800 cursor-pointer hover:underline'>Profile</h1>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-sm text-zinc-800 cursor-pointer hover:underline'>Orders</h1>
        </div>
        <h1 className='font-semibold text-lg text-zinc-800'>Orders</h1>
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
      <div className='w-full lg:h-full flex flex-col-reverse lg:flex-row gap-5 overflow-y-hidden'>
      <div className='lg:w-2/3 h-[100vh] lg:h-full w-full bg-[#f5f5f5] rounded-lg shadow-lg p-5 flex flex-col gap-5'>
      <h1 className='font-semibold text-lg text-zinc-800'>Your Orders Status</h1>
      <div className='flex flex-col gap-5 overflow-auto custom-scroll-bar'>
        {userOrderLoading ? (
          <>
          <Skeleton className='w-full h-[200px]'/>
          <Skeleton className='w-full h-[200px]'/>
          <Skeleton className='w-full h-[200px]'/>
          <Skeleton className='w-full h-[200px]'/>
          </>
        ) : (
          items.map((order) => (
            <div key={order.id} className='py-3 flex flex-col shadow-md px-2'>
              <div className='flex justify-between'>
              <h1 className={`px-3 py-1 w-fit rounded-full text-xs text-[#f5f5f5] ${order.status === 'To Do' ? 'bg-main' : order.status === 'In Progress' ? 'bg-yellow-600' : order.status === 'Finished' ? 'bg-green-600' : 'bg-red-600'}`}>
                {order.status}
              </h1>
              <h1 className='text-xs text-zinc-500'>{format(new Date(order.createdAt), "MMM d, yyyy")}</h1>
              </div>
              <div className='flex flex-col gap-2 mt-2'>
              {order.items.map((item) => (
                <div key={item.id} className='flex w-full'>
                  <Image src={item.image} height={500} width={500} alt='item image' className='object-cover size-20'/>
                  <div className='flex flex-col justify-between px-3'>
                    <div className='flex flex-col'>
                      <h1 className='text-md font-medium text-zinc-800'>{item.name}</h1>
                      <h1 className='text-sm text-zinc-500'>{item.quantity}Pcs</h1>
                    </div>
                    <h1>P {item.price}.00</h1>
                  </div>
                </div>
              ))}
              <div className='flex flex-col mt-2'>
                <h1 className='text-lg font-semibold'>Total: <span className='text-base font-normal'>P {order.cartTotal}.00</span></h1>
                <Button disabled={orderReceived} onClick={() => handleReceivedUpdate(order.id)} className={`bg-main hover:bg-main2 ${order.status === 'Finished' ? '': 'hidden'}`}>Received</Button>
                {order.status === 'Cancelled' && <Button disabled={orderReceived} onClick={() => handleReceivedUpdate(order.id)} className='bg-red-500 hover:bg-red-600'>Remove</Button>}
              </div>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
      <div className='lg:w-1/3 h-full bg-[#f5f5f5] rounded-lg shadow-lg p-5 flex flex-col'>
      <div className='bg-main w-full p-5 rounded-lg flex flex-col gap-5 mb-5'>
              <div className='flex gap-3 items-center'>
              <MessageCircle size={32} className='p-[6px] ml-1 shadow-md rounded-md bg-white text-main'/>
              <h1 className='text-[#f5f5f5] text-xl font-semibold'>Total Feedback</h1>
              </div>
              <div className='w-full'>
              <h1 style={{ fontSize: "50px" }} className='font-bold text-[#f5f5f5]'>{items.length}</h1>
              </div>
            </div>
            <PieCharts/>
          </div>
      </div>
    </div>
  )
}

export default Orders