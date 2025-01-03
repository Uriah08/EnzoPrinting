"use client"

import { Session } from 'next-auth'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import ProductForm from '../Products/ProductForm'
import GetProduct from '../Products/GetProduct'
import { Search, Filter, ShoppingBag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useGetHighlightProductQuery, useGetProductQuery, useHighlightProductMutation } from '@/store/api'
import { Skeleton } from '@/components/ui/skeleton'
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

const Products = ({ session }: {session?: Session | null}) => {

  const { toast } = useToast()
  const { data, isLoading: productLoading } = useGetProductQuery();

  const { data: highlight, isLoading } = useGetHighlightProductQuery()

  const [highlightProduct, {isLoading: highlightLoading}] = useHighlightProductMutation()

  const products = data?.product || []
  const highlights = highlight?.product || []

  const handleRemoveHighlight = async (id: string, status: boolean) => {
    try {
      const response = await highlightProduct({id, status}).unwrap()

      if(!response.success){
          throw new Error(response.message || 'Unknown Error Occured!')
      }else{
          toast({
              title: 'Remove Highlight',
              description: 'The product has been removed in highlighted successfully.'
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

  const [searchQuery, setSearchQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [category, setCategory] = React.useState("all")
  const [sortOrder, setSortOrder] = React.useState("newest");

  const filteredProducts = products
  .filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .filter((product) => category === "all" || product.category === category)
  .filter((product) => {
    if (sortOrder === "highlight") {
      return highlights.some((highlightProduct) => highlightProduct.id === product.id);
    }
    return true;
  })
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

  const [sideOffset, setSideOffset] = useState(0);
  
          React.useEffect(() => {
            const handleResize = () => {
              if (window.innerWidth < 768) {
                setSideOffset(-190);
              } else {
                setSideOffset(0);
              }
            };
        
            handleResize();
            window.addEventListener("resize", handleResize);
        
            return () => window.removeEventListener("resize", handleResize);
          }, []);

  return (
    <div className='flex flex-col w-full gap-3 sm:gap-5 h-full overflow-x-hidden'>
      <div className='flex justify-between w-full bg-[#f5f5f5] py-3 px-5 rounded-lg shadow-lg'>
        <div className='flex-col'>
        <div className='flex gap-1 sm:gap-3 items-center'>
          <Link href={'/'} className='text-xs sm:text-sm text-zinc-500 hover:underline'>Home</Link>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-xs sm:text-sm text-zinc-800 cursor-pointer hover:underline'>Admin</h1>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-xs sm:text-sm text-zinc-800 cursor-pointer hover:underline'>Products</h1>
        </div>
        <h1 className='font-semibold text-sm sm:text-lg text-zinc-800'>Products</h1>
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
      <div className='w-full h-full flex flex-col-reverse xl:flex-row gap-3 sm:gap-5 overflow-y-hidden'>
        
        <div className='xl:w-2/3 w-full h-[100vh] lg:h-full bg-[#f5f5f5] rounded-lg shadow-lg p-3 sm:p-5 flex flex-col gap-5'>
        <h1 className='text-base font-semibold text-zinc-700'>Your Products</h1>
        <div className='w-full flex justify-between items-center'>
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
              <DropdownMenuItem onClick={() => setSortOrder("highlight")}>Highlighted</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder("priceLowHigh")}>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("priceHighLow")}>Price: High to Low</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
              <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
              <DropdownMenuSubContent sideOffset={sideOffset} className="p-0">
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
        <GetProduct products={filteredProducts} isLoading={productLoading}/>
        </div>
        <div className='xl:w-1/3 h-full p-3 sm:p-5 bg-[#f5f5f5] rounded-lg shadow-lg flex flex-col overflow-y-auto custom-scroll-bar'>
          <div className='flex justify-between items-center gap-3'>
          <h1 className='text-sm sm:text-base font-semibold text-zinc-700'>Manage Products</h1>
          <Dialog>
            <DialogTrigger asChild>
            <Button className='bg-main hover:bg-main2'>Create Product</Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
              <DialogTitle>
                Create Product
              </DialogTitle>
              <ProductForm/>
            </DialogContent>
          </Dialog>
          </div>
          <div className='bg-main w-full p-5 rounded-lg flex flex-col gap-5 mt-5'>
              <div className='flex gap-3 items-center'>
              <ShoppingBag size={32} className='p-[6px] ml-1 shadow-md rounded-md bg-white text-main'/>
              <h1 className='text-[#f5f5f5] text-xl font-semibold'>Total Products</h1>
              </div>
              <div className='w-full'>
              <h1 style={{ fontSize: "50px" }} className='font-bold text-[#f5f5f5]'>{products.length}</h1>
              </div>
            </div>
            <div>
              <h1 className='text-sm sm:text-base font-semibold text-zinc-700 mt-5'>Highlighted <span className='text-zinc-500 text-sm font-normal'>(Maximum of 4)</span></h1>
              <div className='flex flex-col gap-3 mt-3'>
                {isLoading ? (
                  <>
                  <Skeleton className='w-full h-[100px] rounded-lg'/>
                  <Skeleton className='w-full h-[100px] rounded-lg'/>
                  <Skeleton className='w-full h-[100px] rounded-lg'/>
                  <Skeleton className='w-full h-[100px] rounded-lg'/>
                  </>
                ) : (
                  highlights.map((product) => (
                    <div key={product.id} className='py-2 w-full flex gap-3'>
                      <Image src={product.image} width={500} height={500} alt='highlighted product' className='h-20 sm:h-24 max-w-20 sm:max-w-24 w-full object-cover'/>
                      <div className='flex-col w-full flex justify-between'>
                        <div className='flex flex-col'>
                        <h1 className='text-xs bg-main rounded-full w-fit px-3 py-[2px] text-[#f5f5f5]'>{product.category}</h1>
                        <h1 className='text-zinc-800 text-sm sm:text-base font-medium'>{product.name}</h1>
                        </div>
                        <div className='flex w-full justify-between items-center'>
                          <h1 className='text-zinc-800 text-xs sm:text-base'>P {product.price}.00</h1>
                          <Button disabled={highlightLoading} onClick={() => handleRemoveHighlight(product.id, false)} className='bg-main hover:bg-main2'>Remove</Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          </div>
    </div>
  )
}

export default Products