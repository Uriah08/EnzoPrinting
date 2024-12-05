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

const SignUpPage = () => {

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
      console.log(response)
    } catch (error) {
      console.log(error);
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