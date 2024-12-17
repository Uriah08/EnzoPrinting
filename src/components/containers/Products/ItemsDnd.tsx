"use client"

import React from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'
import { useGetItemsPurchaseQuery, useUpdateItemStatusMutation } from '@/store/api'
import { Skeleton } from '@/components/ui/skeleton';

const itemStatus = ['To Do', 'In Progress', 'Finished', 'Cancelled'];

const ItemsDnd = () => {

    const isMobileDevice = () => {
        return /Mobi|Android/i.test(navigator.userAgent);
      };
    
      const backend = isMobileDevice() ? TouchBackend : HTML5Backend;
      
      const { data, isLoading} = useGetItemsPurchaseQuery()

      const [updateItemStatus, {isLoading: itemStatusLoading}] = useUpdateItemStatusMutation()

      const items = data?.items || []

      const moveItem = async (id: string, status: string) => {
        try {
          await updateItemStatus({id, status}).unwrap()
          console.log(`Task ${id} moved to ${status}`);
        } catch (err) {
          console.error('Error updating task status', err);
        }
      };

  return (
    <DndProvider backend={backend}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {itemStatus.map((item) => (
          <ItemColumn key={item} status={item} items={items} moveItem={moveItem}/>
        ))}
      </div>
    </DndProvider>
  );
}

interface ItemColumnProps {
  status: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[]
  moveItem: (id: string, toStatus: string) => void
}

const ItemColumn = ({status, items, moveItem}: ItemColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'item',
    drop: (item: {id: string}) => moveItem(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const itemsInColumn = items.filter((item) => item.status === status)

  return (
    <div ref={(instance) => {drop(instance)}} className={`rounded-lg ${isOver ? 'bg-blue-100' : ''}`}>
      <div className={`mb-3 flex w-full rounded-lg shadow-lg ${status === "Cancelled" ? 'bg-red-400' : 'bg-[#f5f5f5]'}`}>
        <div className="flex w-full items-center justify-between rounded-lg bg-myLight px-5 py-4">
          <h3 className="flex items-center text-lg font-semibold">{status}</h3>
          <span className="font-bold text-sm">{itemsInColumn.length}</span>
        </div>
      </div>
      {itemsInColumn.map((item) => (
        <Item key={item.id} item={item}/>
      ))}
    </div>
  );
}

type ItemProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any
}

const Item = ({ item }: ItemProps) => {
  const [{isDragging}, drag] = useDrag(() => ({
    type: "item",
    item: {id: item.id},
    collect: (monitor) => ({
      isDragging:!!monitor.isDragging(),
    })
  }))

  return (
    <div ref={(instance) => {drag(instance)}} className={`mb-4 w-full bg-[#f5f5f5] rounded-lg shadow-md p-5 ${isDragging ? "opacity-50":"opacity-100"}`}></div>
  )
}

export default ItemsDnd