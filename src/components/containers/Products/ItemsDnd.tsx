"use client"

import React from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'
import { useGetItemsPurchaseQuery, useUpdateItemStatusMutation, useLazyGetOrderQuery, useUpdatePurchaseTransactionMutation } from '@/store/api'
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTitle, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import LoadingSpinner from '@/components/ui/loading';

import { format } from "date-fns";

const itemStatus = ['To Do', 'In Progress', 'Finished', 'Cancelled'];

const ItemsDnd = () => {

    const isMobileDevice = () => {
        return /Mobi|Android/i.test(navigator.userAgent);
      };

      const { toast } = useToast();
    
      const backend = isMobileDevice() ? TouchBackend : HTML5Backend;
      
      const { data, isLoading } = useGetItemsPurchaseQuery("pending")

      const [updateItemStatus] = useUpdateItemStatusMutation()

      const items = data?.items || []

      const moveItem = async (id: string, status: string) => {
        try {
          const response = await updateItemStatus({id, status}).unwrap()
          if(!response.success){
            throw new Error(response.message || 'Unkown Error Occured!')
          }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          toast({
            title: 'Error',
            description: error.data.message,
          })
        }
      };

  return (
    <DndProvider backend={backend}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {itemStatus.map((item) => (
          <ItemColumn key={item} status={item} items={items} moveItem={moveItem} loading={isLoading}/>
        ))}
      </div>
    </DndProvider>
  );
}

type Purchase = {
  id: string;
  cartTotal: string;
  userId: string;
  createdAt: Date;
  status: string;
  new: boolean;
  transaction: string
  user: {
      image?: string
      email: string
  }
}

interface ItemColumnProps {
  status: string
  items: Purchase[]
  moveItem: (id: string, toStatus: string) => void
  loading: boolean
}

const ItemColumn = ({status, items, moveItem, loading}: ItemColumnProps) => {

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'item',
    drop: (item: {id: string}) => moveItem(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const itemsInColumn = items.filter((item) => item.status === status)

  return (
    <div ref={(instance) => {drop(instance)}} className={`rounded-lg relative ${isOver ? 'bg-blue-100' : ''}`}>
      <div className={`mb-3 flex w-full rounded-lg shadow-lg ${status === "Cancelled" ? 'bg-red-400' : 'bg-[#f5f5f5]'}`}>
        <div className="flex w-full items-center justify-between rounded-lg bg-myLight px-5 py-4">
          <h3 className="flex items-center text-lg font-semibold">{status}</h3>
          <span className="font-bold text-sm">{itemsInColumn.length}</span>
        </div>
      </div>
      {loading ? (
        <>
        <Skeleton className='w-full h-[100px] mt-3'/>
        <Skeleton className='w-full h-[100px] mt-3'/>
        <Skeleton className='w-full h-[100px] mt-3'/>
        <Skeleton className='w-full h-[100px] mt-3'/>
        </>
      ) : (
        items.length === 0 ? (
          <div className='w-full absolute py-20 text-center text-2xl text-zinc-400 font-bold'>No Orders Found!</div>
        ) : (
          itemsInColumn.length === 0? (
            <div className="text-center py-20 text-2xl text-zinc-400 font-bold">Drag Here!</div>
          ) : (
            itemsInColumn.map((item) => (
              <Item key={item.id} item={item}/>
            ))
          )
        )
      )}
    </div>
  );
}

type ItemProps = {
  item: Purchase
}

const Item = ({ item }: ItemProps) => {

  const [getOrder, { isLoading }] = useLazyGetOrderQuery();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = React.useState<any[]>([]);

  const [updatePurchaseTransaction, {isLoading: transactionLoading}] = useUpdatePurchaseTransactionMutation()

  const { toast } = useToast()

  const [{isDragging}, drag] = useDrag(() => ({
    type: "item",
    item: {id: item.id},
    collect: (monitor) => ({
      isDragging:!!monitor.isDragging(),
    })
  }))

  const handleItemData = async () => {
    try {
      const response = await getOrder(item.id).unwrap()

      const orders = response.orders || []

      if(!response.success) {
        throw new Error(response.message || 'Unknown Error Occured!')
      }

      setOrders(orders);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      toast({
        title: 'Orders Failed to Get!',
        description: error.data.message,
      });
    }
  }

  const handleUpdateTransaction = async (id: string, transaction: string) => {
    try {
      const response = await updatePurchaseTransaction({id, transaction}).unwrap()
      if(!response.success){
        throw new Error(response.message || 'Unknown Error Occured!')
      }
      toast({
        title: 'Transaction Updated!',
        description: 'Transaction has been updated successfully!',
      })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: 'Transaction Failed!',
        description: error.data.message,
      })
    }
  }

  return (
    <div ref={(instance) => {drag(instance)}} className={`mb-4 w-full overflow-hidden flex flex-col bg-[#f5f5f5] rounded-lg shadow-md p-5 ${isDragging ? "opacity-50":"opacity-100"}`}>
      <div className='flex items-center gap-3'>
        <Image src={item.user?.image || '/profile.png'} width={500} height={500} alt='profile' className='size-10 rounded-full'/>
        <h1 className='text-zinc-800 text-sm font-medium'>{item.user.email}</h1>
      </div>
      <div className='flex justify-between items-center mt-3'>
        <h1 className='text-md font-medium text-zinc-800'>₱ {item.cartTotal}.00</h1>
        <h1 className='text-xs text-zinc-500'>{format(new Date(item.createdAt), "MMM d, yyyy")}</h1>
      </div>
      <Dialog>
        <DialogTrigger asChild>
        <Button onClick={handleItemData} className='bg-main mt-3 hover:bg-main2 w-full'>View Order</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className='text-center'>View Orders</DialogTitle>
          {isLoading ? (
            <LoadingSpinner fit/>
          ) : (
            orders.map((order) => (
              <div key={order.id} className='flex gap-3 border-2 rounded-lg'>
                <Image src={order.image} width={500} height={500} className="size-20 object-cover" alt='order image'/>
                <div className="flex flex-col gap-2 justify-between">
                  <div className='flex flex-col'>
                  <h1 className='text-md font-semibold text-zinc-800'>{order.name}</h1>
                  <h1 className='text-zinc-500'>{order.quantity} Pcs</h1>
                  </div> 
                  <h1 className='text-md font-semibold text-zinc-800'>P {order.price}.00</h1>
                </div>
                <div className='flex flex-col gap-2'>
                  <h1 className={`text-zinc-500 ${order.facebook ? '': 'hidden'}`}><span className='text-zinc-800'>Socials:</span> {order?.facebook}</h1>
                  <h1 className={`text-zinc-500 ${order.description ? '': 'hidden'}`}><span className='text-zinc-800'>Message:</span> {order?.description}</h1>
                </div>
              </div>
            ))
          )}
        </DialogContent>
      </Dialog>
      {item.status === 'Finished' ? (
        <Button disabled={transactionLoading} onClick={() => handleUpdateTransaction(item.id,'history')} className='bg-green-700 mt-2 hover:bg-green-800 w-full'>Save Order</Button>
      ): item.status === 'Cancelled' ? (
        <Button disabled={transactionLoading} onClick={() => handleUpdateTransaction(item.id,'cancelled')} className='bg-red-700 mt-2 hover:bg-red-800 w-full'>Cancel Order</Button>
      ) : null}
    </div>
  )
}

export default ItemsDnd