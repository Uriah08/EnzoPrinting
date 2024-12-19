"use client"

import { useGetCartQuery, useDeleteCartMutation, useDeleteAllCartMutation, usePurchaseMutation } from '@/store/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import UpdateCartForm from '@/components/containers/Products/UpdateCartForm';
const CartPage = () => {
  const { data: session, status} = useSession()
  const router = useRouter()
    const { toast } = useToast()
    const { data , isLoading: yourCartLoading } = useGetCartQuery(session?.user?.id ?? '', {
        skip: status !== "authenticated" || !session?.user?.id,
    });

    const [deleteCart, {isLoading: deleteCartLoading}] = useDeleteCartMutation()

    const [deleteAllCart, {isLoading: deletingAllCartsLoading}] = useDeleteAllCartMutation()

    const [purchase,{isLoading: purchaseLoading}] = usePurchaseMutation()

    const handleDeleteCart = async (id: string,letToast?: boolean) => {
        try {
            const response = await deleteCart(id).unwrap()

            if(!response.success){
                throw new Error(response.error|| 'Failed to delete feedback')
            }

            if(letToast) {
                toast({
                    title: 'Cart Deleted!',
                    description: 'Cart has been deleted successfully',
                  })
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast({
                title: 'Cart Delete Failed!',
                description: error.message,
            })
        }
    }

    const handleDeleteAllCart = async (letToast?: boolean) => {
        try {
            if(!session){
                throw new Error('User is not authenticated')
            }
            const response = await deleteAllCart(session?.user.id).unwrap()

            if(!response.success){
                throw new Error(response.message|| 'Failed to delete all cart')
            }

            if(letToast) {
                toast({
                    title: 'Carts Deleted!',
                    description: 'All carts have been deleted successfully',
                })
            }
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error);
            
            toast({
                title: 'Cart Purchase Failed!',
                description: error.data.message,
            })
        }
    }

    const checkout = async (type: string, id?: string) => {
        try {
            if (!data?.cart || data.cart.length === 0) {
                throw new Error('Cart is empty, please add products to proceed.');
            }else if(!session){
                throw new Error('User is not authenticated')
            }

            if (type === "double") {
                const cartDetails = data.cart.map((cart) => ({
                    name: cart.product.name,
                    image: cart.product.image,
                    description: cart.description,
                    facebook: cart.facebook,
                    quantity: Number(cart.quantity).toString(),
                    price: (Number(cart.quantity) * Number(cart.product.price)).toString(),
                }));
        
                const cartTotal = cartDetails.reduce((acc, item) => acc + Number(item.price), 0).toString();
    
                const cart = {
                    cartDetails,
                    userId: session.user.id,
                    cartTotal
                }
    
                const response = await purchase(cart).unwrap()

                await handleDeleteAllCart(false)

                if(!response.success) {
                    throw new Error(response.error || 'Failed to purchase cart')
                }
            } else {
                if (!id) {
                    throw new Error("No product ID provided")
                }
        
                const cartDetails = data.cart
                    .filter((cart) => cart.id === id)
                    .map((cart) => ({
                        name: cart.product.name,
                        image: cart.product.image,
                        description: cart.description,
                        facebook: cart.facebook,
                        quantity: Number(cart.quantity).toString(),
                        price: (Number(cart.quantity) * Number(cart.product.price)).toString(),
                    }));
        
                if (cartDetails.length === 0) {
                    console.log("Product not found in the cart.");
                    return;
                }
        
                const cartTotal = cartDetails[0].price.toString();
        
                const cart = {
                    cartDetails,
                    userId: session.user.id,
                    cartTotal
                }
    
                const response = await purchase(cart).unwrap()

                await handleDeleteCart(id,false)

                if(!response.success) {
                    throw new Error(response.error || 'Failed to purchase cart')
                }
            }
            toast({
                title: 'Cart Purchased!',
                description: 'Cart has been purchased successfully',
            })
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast({
                title: 'Purchase Failed!',
                description: error.data.message,
            })
        }
    };
    

    if(status === "loading") {
        return <LoadingSpinner/>
    }

    if(status === 'unauthenticated') {
        router.push('/')
    }
  return (
    <div className='min-h-[100dvh] w-full p-5 bg-[#dde0e9] flex flex-col gap-5 overflow-y-auto'>
      <div className='bg-[#f5f5f5] py-3 px-5 rounded-lg items-center shadow-lg flex justify-between'>
      <div className='flex-col'>
        <div className='flex gap-3 items-center'>
          <Link href={'/'} className='text-sm text-zinc-500 hover:underline'>Home</Link>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-sm text-zinc-800 cursor-pointer hover:underline'>Cart</h1>
        </div>
        <h1 className='font-semibold text-lg text-zinc-800'>{session?.user.name ? session.user.name[0].toUpperCase() + session.user.name.slice(1).toLowerCase() : ''}&apos;s Cart</h1>
        </div>

            {!session ? (
                <Link href={'/auth/sign-in'} className='cursor-pointer'>
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
            </div>
            )}
        </div>
        <div className='flex xl:flex-row flex-col-reverse gap-5'>
            <div className='xl:w-1/2 w-full bg-[#f5f5f5] p-5 rounded-lg shadow-lg full flex flex-col'>
            <h1 className='text-xl font-semibold text-zinc-600'>Manage Your Cart</h1>
            <div className='w-full flex justify-between items-center my-5'>
                <div className='w-fit flex items-center relative'>
                    <Search size={20} className='absolute left-2 text-zinc-500'/>
                    <Input className='pl-8 rounded-full' placeholder='Search...'/>
                </div>
                <Filter size={32} className='p-[6px] bg-main text-[#f5f5f5] rounded-lg'/>
            </div>
            <div className='flex flex-col gap-3'>
            {yourCartLoading ? (
                <>
                <Skeleton className='w-full h-[200px] rounded-lg'/>
                <Skeleton className='w-full h-[200px] rounded-lg'/>
                <Skeleton className='w-full h-[200px] rounded-lg'/>
                <Skeleton className='w-full h-[200px] rounded-lg'/>
                </>
            ) : (
                data?.cart.length === 0 ? (
                    <div className='w-full h-[50dvh] flex justify-center items-center'>
                        <h1 className='text-xl font-semibold text-zinc-400 text-center'>No Cart Found</h1>
                    </div>
                ) : (
                    data?.cart.map((cart) => (
                        <div key={cart.id} className='flex gap-3 rounded-lg shadow-lg overflow-hidden relative w-full'>
                        <Image src={cart.product?.image || '/noimg.png'} width={500} height={500} alt='cart image' className='w-32 object-cover'/>
                        <div className='flex xl:flex-row flex-col gap-3 w-full'>
                            <div className='flex w-full xl:w-1/2 flex-col py-3'>
                            <div className='flex gap-3 items-center'>
                            <h1 className='text-xs bg-main rounded-full w-fit px-3 py-1 text-[#f5f5f5]'>{cart.product?.category || 'removed'}</h1>
                            <h1 className='text-xs text-zinc-400 w-full'>{format(new Date(cart.createdAt), 'MMM d, yyyy')}</h1>
                            </div>
                                <h1 className='text-base lg:text-lg font-medium text-zinc-600 mt-1'>{cart.product?.name || 'Product Deleted By Admin'}</h1>
                                <p className='text-xs lg:text-sm text-zinc-500 mt-2'>{cart.description}</p>
                            </div>
                            <div className='flex flex-col lg:flex-row xl:flex-col w-full xl:w-1/2 p-3 justify-between'>
                                <div className='flex gap-3 justify-between w-full'>
                                <div className='flex flex-col items-center'>
                                    <h1 className='text-sm lg:text-md font-medium text-zinc-600'>Quantity</h1>
                                    <h1 className='text-xs lg:text-sm font-light text-zinc-500'>{cart.quantity}x</h1>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <h1 className='text-sm lg:text-md font-medium text-zinc-600'>Price</h1>
                                    <h1 className='text-xs lg:text-sm font-light text-zinc-500'>₱ {cart.product?.price || 0}.00</h1>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <h1 className='text-sm lg:text-md font-medium text-zinc-600'>Total Price</h1>
                                    <h1 className='text-xs lg:text-sm font-light text-zinc-500'>₱ {Number(cart.quantity) * Number(cart.product?.price || 0)}.00</h1>
                                </div>
                                </div>
                                <div className='flex w-full gap-3 justify-end lg:mt-0 mt-3 items-center flex-wrap-reverse'>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                        <Button disabled={purchaseLoading} className='bg-main hover:bg-main2 text-[#f5f5f5] lg:text-base text-xs'>Check Out</Button>
                                        </DialogTrigger>
                                        <DialogContent aria-describedby={undefined}>
                                            <DialogTitle>Purchase</DialogTitle>
                                            <DialogDescription>{cart.product?.name ? `Are you sure you want to puchase ${cart.product?.name}?` : 'Item does not exists anymore!'}</DialogDescription>
                                            <div className='flex w-full justify-end gap-3'>
                                                <DialogClose asChild>
                                                    <Button>Cancel</Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Button disabled={!cart.product?.name} onClick={() => checkout("single", cart.id)} className='bg-main text-[#f5f5f5] hover:bg-main2'>Purchase</Button>
                                                </DialogClose>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                        <Button disabled={!cart.product?.name} className=' lg:text-sm text-xs'>Edit</Button>
                                        </DialogTrigger>
                                        <DialogContent aria-describedby={undefined}>
                                            <DialogTitle>Edit Cart</DialogTitle>
                                            <UpdateCartForm cart={cart}/>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                        <Button className='lg:text-sm text-xs' disabled={deleteCartLoading}>Delete</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Delete Cart</DialogTitle>
                                            <DialogDescription>Are you sure you want to delete?</DialogDescription>
                                            <div className='flex w-full gap-3 justify-end'>
                                            <DialogClose asChild>
                                            <Button>Cancel</Button>
                                            </DialogClose>
                                                <DialogClose asChild>
                                                <Button onClick={() => handleDeleteCart(cart.id)} className='bg-red-500 hover:bg-red-600'>Delete</Button>
                                                </DialogClose>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                )
            )}
            </div>
            </div>
            <div className='flex flex-col-reverse xl:flex-col xl:w-1/2 w-full gap-5'>
                <div className='bg-main p-5 rounded-lg shadow-lg justify-between items-center flex'>
                    <h1 className='text-xl font-semibold text-[#f5f5f5]'>Cart Total</h1>
                    <div className='flex gap-5 items-center'>
                        <h1 className={`text-[#f5f5f5] text-sm sm:text-xl`}>₱ {new Intl.NumberFormat("en-US").format(data?.cart.reduce((acc, cart) => acc + Number(cart.quantity) * Number(cart.product?.price || 0),0) || 0)}.00</h1>
                        <Dialog>
                            <DialogTrigger asChild>
                            <Button disabled={deletingAllCartsLoading && !session && yourCartLoading} className={`px-4 py-1 text-sm sm:text-base sm:px-5 sm:py-2 rounded-full bg-[#f5f5f5] shadow-none hover:bg-[#e2e2e2] font-semibold text-main ${data?.cart.length === 0 ? 'hidden':''}`}>Check Out All</Button>
                            </DialogTrigger>
                            <DialogContent aria-describedby={undefined}>
                                <DialogTitle>Check Out All</DialogTitle>
                                <Image src={'/logo.svg'} width={150} height={150} alt='logo' className='mx-auto'/>
                                <div className='flex flex-col gap-2 max-h-[500px] mt-3'>
                                {data?.cart.map((cart) => (
                                    <div key={cart.id} className='flex gap-3 items-center w-full justify-between'>
                                        <h1 className='text-base text-zinc-600 font-semibold'>{cart.product?.name || 'Remove this item'}</h1>
                                        <h1 className='text-sm text-zinc-500 font-light'>{cart.quantity}x</h1>
                                        <h1 className='text-sm text-zinc-500 font-light'>₱ {Number(cart.quantity) * Number(cart.product?.price || 0)}.00</h1>
                                    </div>
                                ))}
                            </div><div className='flex justify-between mt-3'>
                                <h1 className='text-base text-zinc-600 font-semibold'>Total:</h1>
                                <h1 className='text-base text-zinc-600 font-semibold'>₱ {new Intl.NumberFormat("en-US").format(data?.cart.reduce((acc, cart) => acc + Number(cart.quantity) * Number(cart.product?.price || 0),0) || 0)}.00</h1>
                                </div>
                                <DialogClose asChild>
                                <Button disabled={!session?.user.id || deletingAllCartsLoading || data?.cart.some(cart => !cart.product?.name)} onClick={() => checkout("double")} className='bg-main hover:bg-main2 w-full'>Check Out</Button>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <Image src={'/cart-cover.png'} width={2500} height={2500} alt='cart cover' className='w-full object-cover rounded-lg shadow-lg'/>
            </div>
        </div>
    </div>
  )
}

export default CartPage;