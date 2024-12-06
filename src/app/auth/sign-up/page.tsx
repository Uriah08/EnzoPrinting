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

import { registerSchema } from '@/schema'

import { useCreateUserMutation } from '@/store/api'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useToast } from '@/hooks/use-toast'

import { useRouter } from 'next/navigation'

interface ErrorData {
  message: string;
}

const SignUpPage = () => {

  const router = useRouter()

  const { toast } = useToast()

  const [createUser, { isLoading }] = useCreateUserMutation();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const response = await createUser(values)
      
      if(response.error){
        const error = response.error as FetchBaseQueryError;

      if (error.data && (error.data as ErrorData).message) {
        throw new Error((error.data as ErrorData).message);
      } else {
        throw new Error('An unknown error occurred.');
      }
      }else {
        router.push('/auth/sign-in')
        toast({
          title: 'Account created!',
          description: 'You have successfully registered!',
        })
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      toast({
        title: 'Register Failed',
        description: error.message,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-zinc-800'>Username</FormLabel>
              <FormControl>
                <Input type='text' placeholder="Enzo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button disabled={isLoading} className='w-full mt-2 bg-main hover:bg-main2' type="submit">{isLoading ? 'Loading...' : 'Sign Up'}</Button>
        <h1 className='text-center mt-1 text-xs text-zinc-500'>
          Already have an account? <Link href='/auth/sign-in' className='hover:underline'>Sign In</Link>
        </h1>
        </div>
      </form>
    </Form>
  );
}

export default SignUpPage