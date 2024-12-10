"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

import { productSchema } from '@/schema'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from '@/components/ui/textarea'
import { Check, ChevronsUpDown } from 'lucide-react';

import { useUpdateProductMutation } from '@/store/api'
import { useToast } from '@/hooks/use-toast'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

const categories = [
    { label: "Paper", value: "paper" },
    { label: "Book", value: "book" },
    { label: "Mug", value: "mug" },
    { label: "Shirt", value: "shirt" },
    { label: "Keychain", value: "keychain" },
    { label: "Sticker", value: "sticker" },
    { label: "ID", value: "id" },
    { label: "Bundle", value: "bundle"},
    { label: "Other", value: "other" }
  ] as const

  interface ErrorData {
    message: string;
  }

  type Product = {
    name:string
    description: string
    price: string
    category: string
    id: string
  }

  type ProductProps = {
    product: Product,
  }

const UpdateProductForm = ({product}: ProductProps) => {

  const { toast } = useToast()

  const [updateProduct, { isLoading }] = useUpdateProductMutation()

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category
        }
    })

    async function onSubmit(values: z.infer<typeof productSchema>){

      const updatedProduct = {
        ...values,
        id: product.id
      }

        try {
          const response = await updateProduct(updatedProduct)
          if(response.error){
            const error = response.error as FetchBaseQueryError;
    
          if (error.data && (error.data as ErrorData).message) {
            throw new Error((error.data as ErrorData).message);
          } else {
            throw new Error('An unknown error occurred.');
          }
          }else {
            toast({
              title: 'Product Updated',
              description: 'Product is updated',
            })
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          toast({
            title: 'Updating Product Failed',
            description: error.message,
          })
        }
    } 

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
            <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                    <Input placeholder="shadcn" {...field} />
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
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="description..." {...field} className='!resize-none'/>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
        />
        <div className='flex gap-3 items-center'>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className='pb-[5px] mt-[5px]'>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between w-full",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? categories.find(
                            (category) => category.value === field.value
                          )?.label
                        : "Select category"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            value={category.label}
                            key={category.value}
                            onSelect={() => {
                              form.setValue("category", category.value)
                            }}
                          >
                            {category.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                category.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
            <FormItem className='w-full'>
                <FormLabel>Product Price</FormLabel>
                <FormControl>
                    <Input placeholder="shadcn" type='number' {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
        />
        </div>
        <Button disabled={isLoading} type='submit' className='w-full bg-main hover:bg-main2'>{isLoading ? 'Updating...':'Update Product'}</Button>
        </form>
    </Form>
  )
}

export default UpdateProductForm