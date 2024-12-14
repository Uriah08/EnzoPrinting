"use client"

import LoadingSpinner from '@/components/ui/loading'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGetProductQuery, useCreateCartMutation, useGetCartQuery } from '@/store/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { productDescription } from '@/schema'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'

import { useToast } from '@/hooks/use-toast'

const ProductPage = () => {

    const { toast } = useToast();

    const [active, setActive] = useState('All')
    const [quantity, setQuantity] = useState(1);

    const form = useForm<z.infer<typeof productDescription>>({
    resolver: zodResolver(productDescription),
    defaultValues: {
      description: "",
      facebook: ""
    },
  })

    const productNav = [
        {label: 'All'},{label: 'Paper'},{label: 'Book'},{label: 'Mug'},{label: 'Shirt'},{label: 'ID'},{label: 'Keychain'},{label: 'Sticker'},{label: 'Other'}
    ]
    
    const { data: session, status} = useSession()

    const { data: cartData, isLoading: yourCartLoading } = useGetCartQuery(session?.user?.id ?? '', {
        skip: status !== "authenticated" || !session?.user?.id,
      });
    
    const { data, isLoading } = useGetProductQuery();

    const products = data?.product || []

    const [createCart, { isLoading : cartLoading }] = useCreateCartMutation()

    async function onSubmit(values: z.infer<typeof productDescription>, productId: string, quantity: number) {

        if(!session) {
            toast({
                title: 'Error',
                description: 'Please Sign In First',
            })
            return  
        }
        const product = {
            ...values,
            productId,
            quantity: quantity.toString(),
            userId: session.user.id
        }
        try {
            const response = await createCart(product).unwrap()
            if(!response.success){
                throw new Error(response.error|| 'Failed to delete feedback')
              }

            toast({
                title: 'Successfull',
                description: 'Item added to your cart!'
            })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            toast({
                title: 'Sending Feedback Failed!',
                description: error.message,
              })
        }
      }
    
      const handleReset = () => {
        form.reset()
        setQuantity(1)
      }

    if (status === 'loading') return <LoadingSpinner/>
  return (
    <div className='min-h-[100dvh] w-full p-5 bg-[#dde0e9] flex flex-col gap-5 overflow-y-auto'>
        <div className='bg-[#f5f5f5] py-3 px-5 rounded-lg items-center shadow-lg flex justify-between'>
            <h1 className='text-xl sm:text-2xl font-bold text-zinc-800'>Product Page</h1>

            {!session ? (
                <Link href={'/auth/sign-in'} className='cursor-pointer mt-5'>
                <button className='tracking-widest py-2 px-10 bg-main rounded-full duration-200 transition-all hover:bg-main2 font-medium text-[#f3f3f3]'>
                    LOGIN
                </button>
                </Link>
            ) : (
                <div className='flex gap-5 items-center'>
                <Link href='/profile' className='cursor-pointer flex items-center gap-3'>
            <div className='flex flex-col items-end'>
                        <p className='text-base font-medium text-zinc-800 hidden sm:block'>{session.user.name}</p>
                        <p className='text-sm font-medium text-zinc-600 hidden sm:block'>{session.user.email}</p>
                    </div>
                <Image src={session.user.image ? session.user.image : '/profile.png'} width={700} height={700} alt='profile' className='size-[45px] rounded-full'/>
            </Link>
            <Link href={'/cart'} className='relative'>   
                    <ShoppingCart size={35} className='text-zinc-500'/>
                    <h1 className={`bg-red-500 size-5 rounded-full top-0 absolute -right-[5px] flex items-center justify-center text-white text-xs ${!cartData?.cart?.length || yourCartLoading || cartData?.cart?.length === 0 ? 'hidden' : ''}`}>{cartData?.cart?.length || 0}</h1>
                </Link>
            </div>
            )}
        </div>
        <div className='lg:w-2/3 w-full flex flex-col gap-5'>
        <Image src={'/store-cover.png'} width={2500} height={2500} alt='cover' className='rounded-lg shadow-lg w-full object-cover'/>
        <div className='w-full bg-[#f5f5f5] p-5 shadow-lg rounded-lg relative min-h-[40vh]'>
            <h1 className='text-xl font-semibold text-zinc-600'>Products</h1>
            <div className='flex gap-x-2 gap-y-1 sm:gap-x-3 mt-5 flex-wrap'>
                {productNav.map((nav) => (
                    <h1 key={nav.label} onClick={() => setActive(nav.label)} className={`text-sm lg:text-lg font-light cursor-pointer px-3 sm:px-5 py-1 rounded-sm ${active === nav.label ? 'text-[#f5f5f5] bg-main':'text-zinc-400'}`}>{nav.label}</h1>
                ))}
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 mt-5'>
                {isLoading ? (
                    <>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    </>
                ) : (
                    products.length === 0 ? (
                        <div className='absolute flex items-center justify-center text-2xl font-semibold text-zinc-500 w-full'>No Products Found</div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className='flex flex-col p-3 border border-zinc-300 gap-4'>
                                <Image src={product.image} width={500} height={500} alt='image' className='h-20 lg:h-72 sm:h-32 object-cover w-full object-center'/>
                                <h1 className='px-2 py-1 rounded-full bg-main text-[#f5f5f5] text-xs w-fit'>{product.category}</h1>
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                                    <h1 className='text-xs lg:text-xl font-semibold'>{product.name}</h1>
                                    <h1 className='text-xs lg:text-sm text-zinc-700'>₱ {product.price}.00</h1>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                    <Button disabled={product.status === 'out of stock' || product.status === 'maintenance'} onClick={handleReset} className='bg-main hover:bg-main2'>
                                        {product.status === 'out of stock' ? 'Out of Stock' : product.status === 'maintenance' ? 'Not Available' : 'Inquire'}
                                    </Button>
                                    </DialogTrigger>
                                    <DialogContent aria-describedby={undefined}>
                                        <DialogTitle className='text-center'>Product Information</DialogTitle>
                                        <Form {...form}>
                                        <form onSubmit={form.handleSubmit((values) => onSubmit(values, product.id, quantity))}>
                                        <div className='flex flex-col gap-3 mt-5'>
                                            <div className='flex gap-3'>
                                            <Image src={product.image} width={500} height={500} alt='product image' className='size-36 object-cover'/>
                                            <div className='flex flex-col justify-between'>
                                                <div className='flex flex-col gap-3'>
                                                <h1 className='text-xl font-semibold text-zinc-700'>{product.name}</h1>
                                                <h1 className='text-xs px-3 py-1 bg-main rounded-full text-[#f5f5f5] w-fit'>{product.category}</h1>
                                                </div>
                                                <h1>₱ {product.price}.00</h1>
                                            </div>
                                            </div>
                                        <p className='text-sm indent-10'>{product.description}</p>
                                        <FormField
                                                control={form.control}
                                                name="facebook"
                                                render={({ field }) => (
                                                    <FormItem className='mt-5'>
                                                    <FormLabel>Your Facebook Profile Link</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Add link here..." {...field} className='resize-none'/>
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                                />
                                        <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel>Customize</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Add text here..." {...field} className='resize-none'/>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Tell the admin what you want to add or revise.
                                                    </FormDescription>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                                />
                                                <div className='flex justify-between'>
                                                    <div className='flex flex-col'>
                                                        <h1 className='text-sm'>Product Quantity:</h1>
                                                        <div className='flex gap-3 items-center mt-2'>
                                                        <button type="button" onClick={() => setQuantity((prev) => (prev + 1))} className='size-6 flex items-center justify-center text-[#f5f5f5] rounded-sm bg-main hover:bg-main2'>+</button>
                                                        <h1 className='w-[30px] text-center'>{quantity}</h1>
                                                        <button type="button" onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))} className='size-6 flex items-center justify-center text-[#f5f5f5] rounded-sm bg-main hover:bg-main2'>-</button>
                                                    </div>
                                                    </div>
                                                    <h1 className='self-end'><span className='text-lg font-semibold'>Total:</span> ₱ {Number(product.price || 0) * quantity}.00</h1>
                                                </div>
                                        </div>
                                        {!session ? (
                                            <Link href={'/auth/sign-in'} className='w-full mt-5'>
                                            <Button className='text-[#f5f5f5] bg-main hover:bg-main2 px-3 rounded-full w-full'>LOGIN</Button>
                                            </Link>
                                        ) : (
                                            <div className='flex w-full justify-end gap-3 mt-5'>
                                                <DialogClose asChild>
                                                <Button type="button" className='bg-[#f5f5f5] hover:bg-[#dddcdc] text-black'>Check Out</Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                <Button type='submit' disabled={cartLoading} className='text-[#f5f5f5] bg-main hover:bg-main2'>{cartLoading ? 'Loading...':'Add to Cart'}</Button>
                                                </DialogClose>
                                            </div>
                                        )}
                                        </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ))
                    )
                )}
        </div>
        </div>
        </div>
    </div>
  )
}

export default ProductPage