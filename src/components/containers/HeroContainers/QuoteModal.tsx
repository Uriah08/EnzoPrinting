"use client"

import React from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image';
import { motion } from "framer-motion";

import { Check, ChevronsUpDown, Clock, GalleryVerticalEnd, Paintbrush, User, Mail, Phone, Contact } from "lucide-react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"

import { quoteSchema } from "@/schema";
import { Textarea } from '@/components/ui/textarea';

import { useToast } from '@/hooks/use-toast'
import { useCreateQuoteMutation, useSendQuoteMutation } from '@/store/api';

const images = [
  "/quotes/quote1.png",
  "/quotes/quote2.png",
  "/quotes/quote3.png",
  "/quotes/quote4.png",
  "/quotes/quote5.png",
];

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

const QuoteModal = () => {

  const { toast } = useToast()

  const [createQuote, {isLoading} ] = useCreateQuoteMutation()
  const [sendQuote] = useSendQuoteMutation()

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof quoteSchema>) {
    try {
      const response = await createQuote(values).unwrap()

      if(!response.success){
        throw new Error(response.message || 'Failed to send a quote')
      }
      await sendQuote(values).unwrap()
      form.reset()

      toast({
        title: 'Quote Sent',
        description: 'Your quote has been sent successfully. We will get back to you soon!'
      })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      toast({
        title: 'Quote Failed to Send',
        description: error.data.message
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
      <div className='mt-3 sm:mt-5 py-2 px-4 cursor-pointer bg-main duration-200 transition-all hover:bg-main2 rounded-full font-medium text-[#f3f3f3] sm:text-base text-sm'>
            REQUEST A QUOTE
        </div>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle className="text-lg md:text-2xl text-neutral-600 font-bold text-center sm:mb-8">
          Request your{" "}
              <span className="px-1 sm:py-0.5 rounded-md bg-gray-100 border border-gray-200">
                Quote
              </span>{" "}
              now! 📚
        </DialogTitle>
        <div className="hidden justify-center items-center sm:flex">
              {images.map((image, idx) => (
                <motion.div
                  key={"images" + idx}
                  style={{
                    rotate: Math.random() * 20 - 10,
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  whileTap={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  className="rounded-xl -mr-4 mt-4 p-1 bg-white border border-neutral-100 flex-shrink-0 overflow-hidden"
                >
                  <Image
                    src={image}
                    alt="bali images"
                    width="500"
                    height="500"
                    className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                  />
                </motion.div>
              ))}
            </div>
            <div className="py-2 sm:py-10 flex flex-wrap gap-x-2 gap-y-3 sm:gap-x-4 sm:gap-y-6 items-start justify-start max-w-sm mx-auto">
              <div className="flex items-center justify-center">
                <GalleryVerticalEnd className="mr-1 text-neutral-700 h-4 w-4" />
                <span className="text-neutral-700 text-xs sm:text-sm">
                  60+ over customizable products
                </span>
              </div>
              <div className="flex items-center justify-center">
                <Clock className="mr-1 text-neutral-700 h-4 w-4" />
                <span className="text-neutral-700 text-xs sm:text-sm">
                  48 hours
                </span>
              </div>
              <div className="flex items-center justify-center">
                <Paintbrush className="mr-1 text-neutral-700 h-4 w-4" />
                <span className="text-neutral-700 text-xs sm:text-sm">
                  Custom Design
                </span>
              </div>
              <div className="flex  items-center justify-center">
                <Contact className="mr-1 text-neutral-700 h-4 w-4" />
                <span className="text-neutral-700 text-xs sm:text-sm">
                Direct Contact
                </span>
              </div>
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col">
              <div className="flex sm:flex-row flex-col sm:gap-5 items-start w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel className='text-xs sm:text-sm'>Name</FormLabel>
                    <FormControl>
                      <div className="flex relative">
                      <User size={25} className="text-zinc-500 absolute top-1/2 -translate-y-1/2 ml-2"/>
                      <Input placeholder="Abby Amayan" {...field} className="rounded-none pl-10"/>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel className='text-xs sm:text-sm'>Email</FormLabel>
                    <FormControl>
                      <div className="flex relative w-full">
                      <Mail size={25} className="text-zinc-500 absolute top-1/2 -translate-y-1/2 ml-2"/>
                      <Input type="email" placeholder="sample@email.com" {...field} className="rounded-none pl-10"/>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <div className="flex sm:flex-row flex-col sm:gap-5 items-start w-full mt-3">
              <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full sm:w-1/2">
              <FormLabel className='pb-[5px] mt-[5px]'>Product Type</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between w-full rounded-none",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? categories.find(
                            (category) => category.value === field.value
                          )?.label
                        : "Select type"}
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
                              form.setValue("type", category.value)
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
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel className='text-xs sm:text-sm'>Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex relative w-full">
                      <Phone size={25} className="text-zinc-500 absolute top-1/2 -translate-y-1/2 ml-2"/>
                      <Input type="number" placeholder="09123456789" {...field} className="rounded-none pl-10"/>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full mt-3">
                    <FormLabel className='text-xs sm:text-sm'>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Message here..." {...field} className="rounded-none resize-none"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <Button disabled={isLoading} type='submit' className='mt-3 w-full bg-main hover:bg-main2'>{isLoading ? 'Requesting...':'Request'}</Button>
              </form>
            </Form>
      </DialogContent>
    </Dialog>
  )
}

export default QuoteModal;