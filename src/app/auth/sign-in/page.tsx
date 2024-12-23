"use client"

import React from 'react'
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link'

import { loginSchema } from '@/schema'

import { useLoginUserMutation } from '@/store/api'
import { useToast } from '@/hooks/use-toast'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useRouter } from 'next/navigation'

interface ErrorData {
  message: string;
}
const SignInPage = () => {

  localStorage.setItem("reloaded", "false");

  const router = useRouter()
  const { toast } = useToast()

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await loginUser(values)
      
      if(response.error){
        const error = response.error as FetchBaseQueryError;

      if (error.data && (error.data as ErrorData).message) {
        throw new Error((error.data as ErrorData).message);
      } else {
        toast({
          title: 'Login Successfully',
          description: 'Redirecting to your home page...',
        })
        router.push('/admin')
      }
      }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      toast({
        title: 'Login Failed',
        description: error.message,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-zinc-800'>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder="enzo_prints@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-zinc-800'>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="*********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='w-full flex flex-col'>
        <Button disabled={isLoading} className='w-full mt-2 bg-main hover:bg-main2' type="submit">{isLoading ? 'Loading...': 'Sign In'}</Button>
        <h1 className='text-center mt-1 text-xs text-zinc-500'>
          Don&apos;t have an account? <Link href='/auth/sign-up' className='hover:underline'>Sign Up</Link>
        </h1>
        </div>
      </form>
    </Form>
  )
}

export default SignInPage