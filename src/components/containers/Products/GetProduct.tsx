"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

import { useDeleteProductMutation, useGetProductQuery, useHighlightProductMutation } from '@/store/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import UpdateProductForm from './UpdateProductForm'
import { StarIcon } from 'lucide-react'

const GetProduct = () => {
    const { data, isLoading } = useGetProductQuery();
    const [deleteProduct, {isLoading: productLoading}] = useDeleteProductMutation();
    const { toast} = useToast()

    const products = data?.product || []

    const handleDeleteProduct = async (id: string) => {
        try {
            const response = await deleteProduct(id).unwrap()
            if(!response.success){
                throw new Error(response.message || 'Unknown Error Occured!')
            }else{
                toast({
                    title: 'Product Deleted Successfully',
                    description: 'The product has been deleted successfully.'
                })
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast({
            title: 'Delete Product Failed',
            description: error.message
            })
        }
    }

    const [highlightProduct, { isLoading: highlightLoading }] = useHighlightProductMutation();

    const handleHighlight = async (id: string, status: boolean) => {
        try {
        const response = await highlightProduct({id, status}).unwrap()

        if(!response.success){
            throw new Error(response.message || 'Unknown Error Occured!')
        }else{
            toast({
                title: 'Product Highlighted',
                description: 'The product has been highlighted successfully.'
            })
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast({
                title: 'Highlight Product Failed',
                description: error.data.message
                })
        }
    }
    
  return (
    <div className='flex flex-col w-full gap-3 overflow-y-auto h-full custom-scroll-bar'>
        {isLoading ? (
            <>
            <Skeleton className='w-full h-[200px]'/>
            <Skeleton className='w-full h-[200px]'/>
            <Skeleton className='w-full h-[200px]'/>
            </>
        ): (
            products.length === 0 ? (
                <h1 className='text-zinc-400 text-center text-lg font-semibold'>No Products</h1>
            ) : (
                products.map((product) => (
                    <div key={product.id} className='flex flex-col justify-between'>
                    <div className='flex p-3 gap-3 shadow-lg rounded-lg'>
                        <Image src={product.image} width={500} height={500} alt='product image' className='md:h-40 md:max-w-40 h-full max-w-16 sm:max-w-24 w-full object-cover'/>
                        <div className='flex flex-col w-full h-full justify-between'>
                            <div className='flex-col gap-3 flex'>
                                <div className='flex flex-row md:flex-col gap-2'>
                                    <div className='flex justify-between items-center'>
                                    <h1 className='text-xs sm:text-lg font-semibold text-zinc-700'>{product.name}</h1>
                                    <button disabled={highlightLoading} onClick={() => handleHighlight(product.id, true)} className='cursor-pointer'>
                                    <StarIcon className={`${highlightLoading ? 'text-[#ddc060]': 'text-[#caa631]'}`} fill={`${product.highlight ? highlightLoading ? '#ddc060': '#caa631' : '#f5f5f5' }`}/>
                                    </button>
                                    </div>
                                <h1 className='px-1 sm:px-3 sm:py-1 bg-main rounded-lg text-[#f5f5f5] text-xs sm:text-sm w-fit'>{product.category}</h1>
                                </div>
                            <p className='text-xs md:text-sm text-zinc-500'>{product.description}
                            </p>
                            </div>
                            <div className='flex justify-between items-center font-semibold mt-2'>
                                <h1 className='text-xs md:text-sm text-zinc-800'>Price: {product.price}</h1>
                                <div className='flex gap-1 sm:gap-3'>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                        <Button className='bg-main hover:bg-main2 text-xs sm:text-base px-2 sm:px-4'>Edit</Button>
                                        </DialogTrigger>
                                        <DialogContent aria-describedby={undefined}>
                                            <DialogTitle>Edit Product</DialogTitle>
                                            <UpdateProductForm product={product}/>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                        <Button disabled={productLoading} className='bg-red-500 hover:bg-red-600 text-xs sm:text-base px-2 sm:px-4'>Delete</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Delete Product</DialogTitle>
                                            <DialogDescription>
                                                Are you sure you want to delete {product.name}?
                                            </DialogDescription>
                                            <div className='w-full flex justify-end gap-3'>
                                                <DialogClose asChild>
                                                    <Button disabled={productLoading} onClick={() => handleDeleteProduct(product.id)} className='bg-red-500 hover:bg-red-600'>{productLoading ? 'Deleting...':'Delete'}</Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                    <Button>Cancel</Button>
                                                </DialogClose>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                ))
            )
        )}
    </div>
  )
}

export default GetProduct