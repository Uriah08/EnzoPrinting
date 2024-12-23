"use client"

import LoadingSpinner from '@/components/ui/loading'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Filter, Search } from 'lucide-react'
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

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

const categories = [
    "all",
    "mug",
    "shirt",
    "paper",
    "book",
    "id",
    "keychain",
    "sticker",
    "bundle",
    "other"
  ]

const ProductPage = () => {

    const { toast } = useToast();
    const [quantity, setQuantity] = useState(1);

    const form = useForm<z.infer<typeof productDescription>>({
    resolver: zodResolver(productDescription),
    defaultValues: {
      description: "",
      facebook: ""
    },
  })
    
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

      const [searchQuery, setSearchQuery] = React.useState("")
        const [open, setOpen] = React.useState(false)
        const [category, setCategory] = React.useState("all")
        const [sortOrder, setSortOrder] = React.useState("newest");
      
        const filteredProducts = products
        .filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((product) => category === "all" || product.category === category)
        .sort((a, b) => {
          if (sortOrder === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          if (sortOrder === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          if (sortOrder === "priceLowHigh") {
            return Number(a.price) - Number(b.price);
          }
          if (sortOrder === "priceHighLow") {
            return Number(b.price) - Number(a.price);
          }
          return 0;
        });
      

    if (status === 'loading') return <LoadingSpinner/>
  return (
    <div className='min-h-[100%] w-full p-3 sm:p-5 bg-[#dde0e9] flex flex-col gap-3 sm:gap-5 overflow-y-auto'>
        <div className='bg-[#f5f5f5] py-3 px-5 rounded-lg items-center shadow-lg flex justify-between'>
        <div className='flex-col'>
        <div className='flex gap-1 sm:gap-3 items-center'>
          <Link href={'/'} className='text-xs sm:text-sm text-zinc-500 hover:underline'>Home</Link>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-xs sm:text-sm text-zinc-800 cursor-pointer hover:underline'>Products</h1>
        </div>
        <h1 className='font-semibold text-sm sm:text-lg text-zinc-800'>Products</h1>
        </div>
            {!session ? (
                <Link href={'/auth/sign-in'} className='cursor-pointer mt-5'>
                <button className='tracking-widest py-2 sm:text-base text-xs px-5 sm:px-10 bg-main rounded-full duration-200 transition-all hover:bg-main2 font-medium text-[#f3f3f3]'>
                    LOGIN
                </button>
                </Link>
            ) : (
                <div className='flex gap-3 sm:gap-5 items-center'>
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
        <div className='w-full h-full rounded-lg flex flex-col gap-3 sm:gap-5 overflow-hidden'>
            <div className='flex md:flex-row flex-col gap-3 sm:gap-5'>
            <Image src={'/store-cover.png'} width={2500} height={2500} alt='cover' className='rounded-lg shadow-lg md:w-1/3 w-full object-cover'/>
            <Image src={'/store-cover-hero.png'} width={2500} height={2500} alt='cover' className='rounded-lg shadow-lg md:w-2/3 w-full object-cover'/>
            </div>
        <div className='w-full bg-[#f5f5f5] p-3 sm:p-5 shadow-lg rounded-lg relative'>
            <h1 className='text-sm sm:text-xl font-semibold text-zinc-600'>Products</h1>
            <div className='w-full flex justify-between items-center mt-5'>
          <div className='w-fit flex items-center relative'>
            <Search size={20} className='absolute left-2 text-zinc-500'/>
            <Input className='pl-8 rounded-full' placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger>
              <Filter size={32} className='p-[6px] bg-main text-[#f5f5f5] rounded-lg'/>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter</DropdownMenuLabel>
              <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSortOrder("newest")}>Newest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")}>Oldest</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder("priceLowHigh")}>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("priceHighLow")}>Price: High to Low</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
              <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
              <Command>
              <CommandInput
                    placeholder="Filter category..."
                    autoFocus={true}
                    className="h-9"
                  />
                  <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((item) => (
                      <CommandItem
                      key={item}
                      value={item}
                      onSelect={(value) => {
                        setCategory(value)
                        setOpen(false)
                      }}
                    >
                      {item}
                    </CommandItem>
                    ))}
                  </CommandGroup>
                  </CommandList>
              </Command>
              </DropdownMenuSubContent>
              </DropdownMenuSub>
              </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        <h1 className='text-sm sm:text-xl font-semibold text-zinc-600 mt-10'>Products</h1>
            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 mt-5'>
                {isLoading ? (
                    <>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    <Skeleton className='w-full h-[340px] rounded-lg'/>
                    </>
                ) : (
                    filteredProducts.length === 0 ? (
                        <div className='absolute flex items-center justify-center text-2xl font-semibold text-zinc-500 w-full'>No Products Found</div>
                    ) : (
                        filteredProducts.map((product) => (
                            <div key={product.id} className='flex flex-col h-fit p-1 sm:p-3 border border-zinc-300 gap-4'>
                                <Image src={product.image} width={500} height={500} alt='image' className='h-20 lg:h-72 sm:h-32 object-cover w-full object-center'/>
                                <h1 className='px-2 py-1 rounded-full bg-main text-[#f5f5f5] text-xs w-fit'>{product.category}</h1>
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                                    <h1 className='text-sm lg:text-xl font-semibold'>{product.name}</h1>
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
                                            <Button className='text-[#f5f5f5] bg-main hover:bg-main2 px-3 rounded-full w-full mt-5'>LOGIN</Button>
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