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

import { UploadButton } from "@/utils/uploadthing";
import Image from 'next/image'
import { useCreateProductMutation } from '@/store/api'
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
const ProductForm = () => {

  const { toast } = useToast()

  const [uploadedFileUrl, setUploadedFileUrl] = React.useState<string | null>(null);
  const [isUploadDisabled, setIsUploadDisabled] = React.useState<boolean>(false);

  const [createProduct, {isLoading}] = useCreateProductMutation();

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: '',
            category: ''
        }
    })

    async function onSubmit(values: z.infer<typeof productSchema>){
        const product = {
          ...values,
          image: uploadedFileUrl
        }
        try {
          const response = await createProduct(product)
          if(response.error){
            const error = response.error as FetchBaseQueryError;
    
          if (error.data && (error.data as ErrorData).message) {
            throw new Error((error.data as ErrorData).message);
          } else {
            throw new Error('An unknown error occurred.');
          }
          }else {
            form.reset()
            setUploadedFileUrl(null)
            setIsUploadDisabled(false);
            toast({
              title: 'Product Created',
              description: 'Product saved in the database.',
            })
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          toast({
            title: 'Creating Product Failed',
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
        {!uploadedFileUrl ? (
              <UploadButton
              endpoint="imageUploader"
              className={`${(isUploadDisabled) ? 'hidden':''} bg-zinc-300`}
              onClientUploadComplete={(res) => {
                if (res.length > 0) {
                  const fileUrl = res[0].url;
                  setUploadedFileUrl(fileUrl);
                  setIsUploadDisabled(true);
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
            ):(
              <Image src={uploadedFileUrl} width={100} height={100} alt="image"/>
            )}
        <Button disabled={isLoading} type='submit' className='w-full bg-main hover:bg-main2'>{isLoading ? 'Creating...':'Create Product'}</Button>
        </form>
    </Form>
  )
}

export default ProductForm