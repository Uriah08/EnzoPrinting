'use client'

import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { productDescription } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { DialogClose } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useUpdateCartMutation } from '@/store/api'

type CartProps = {
    cart: {
        id: string;
        description?: string;
        facebook?: string;
        productId: string;
        quantity: string;
        userId: string;
        createdAt: Date;
        product: {
            id: string;
            name: string;
            category: string;
            image: string;
            price: string;
        }
    }
}

const UpdateCartForm = ({cart}: CartProps) => {

    const { toast } = useToast()

    const [updateCart, {isLoading}] = useUpdateCartMutation()

    const [quantity, setQuantity] = useState(Number(cart.quantity));
    
    const form = useForm<z.infer<typeof productDescription>>({
        resolver: zodResolver(productDescription),
        defaultValues: {
          description: cart.description,
          facebook: cart.facebook
        },
      })
      
      const onSubmit = async (values: z.infer<typeof productDescription>, quantity: number, id: string) => {
        const updatedCart = {
            ...values,
            quantity: quantity.toString(),
            id
        }
        try {
            const response = await updateCart(updatedCart).unwrap()

            if(!response.success){
                throw new Error(response.message || 'Unknown Error Occured')
            }
            toast({
                title: 'Update Successful!',
                description: 'Cart updated successfully'
            })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast({
                title: 'Update Failed!',
                description: error.message
            })
        }
      }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => onSubmit(values,quantity,cart.id))}>
        <div className='flex flex-col gap-3 mt-5'>
            <div className='flex gap-3'>
            <Image src={cart.product.image} width={500} height={500} alt='product image' className='size-36 object-cover'/>
            <div className='flex flex-col justify-between'>
                <div className='flex flex-col gap-3'>
                <h1 className='text-xl font-semibold text-zinc-700'>{cart.product.name}</h1>
                <h1 className='text-xs px-3 py-1 bg-main rounded-full text-[#f5f5f5] w-fit'>{cart.product.category}</h1>
                </div>
                <h1>₱ {cart.product.price}.00</h1>
            </div>
            </div>
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
                        <h1 className='self-end'><span className='text-lg font-semibold'>Total:</span> ₱ {Number(cart.product.price || 0) * Number(cart.quantity)}.00</h1>
                    </div>
            </div>
            <DialogClose asChild>
            <Button disabled={isLoading} type='submit' className='text-[#f5f5f5] bg-main hover:bg-main2 mt-5 w-full'>Update</Button>
            </DialogClose>

        </form>
    </Form>
  )
}

export default UpdateCartForm