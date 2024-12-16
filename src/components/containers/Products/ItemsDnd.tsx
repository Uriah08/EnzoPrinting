"use client"

import React from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'
import { useGetItemsPurchaseQuery } from '@/store/api'

const itemStatus = ['To Do', 'In Progress', 'Finished', 'Cancelled'];

const ItemsDnd = () => {

    const isMobileDevice = () => {
        return /Mobi|Android/i.test(navigator.userAgent);
      };
    
      const backend = isMobileDevice() ? TouchBackend : HTML5Backend;
      
      const { data: items = [], isLoading} = useGetItemsPurchaseQuery()

  return (
    <div className='flex gap-5 md:flex-row flex-col w-full'></div>
  )
}

export default ItemsDnd