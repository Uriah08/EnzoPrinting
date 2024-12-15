import { prisma } from '@/lib/db'
import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email().min(2).max(50),
    password: z.string().min(8,{
      message: "Password must be at least 8 characters long",
    }).max(20,{
      message: "Password must be at most 20 characters long",
    }),
  })

export const registerSchema = z.object({
    username: z.string().min(5,{
      message: "Username must be at least 5 characters long",
    }).max(30,{
      message: "Username must be at most 30 characters long",
    }),
    email: z.string().email().min(5).max(50),
    password: z.string().min(8,{
      message: "Password must be at least 8 characters long",
    }).max(20,{
      message: "Password must be at most 20 characters long",
    }),
  })

  export const feedbackSchema = z.object({
    feedback: z.string().nonempty("Feedback is required")
  })

  export const findUserById = async (id: string) => {
    const user = prisma.user.findUnique({
      where: {
        id
      }
    })

    return user
  }

  // export const findUserRole = async (id: string) => {
  //   const user = prisma
  // }

  export const productSchema = z.object({
    name: z.string().min(3).max(30),
    description: z.string(),
    category: z.string(),
    price: z.string(),
    status: z.string().optional()
  })

  export const productDescription = z.object({
    facebook: z.string(),
    description: z.string().optional()
  })

  export const quoteSchema = z.object({
    name: z.string().min(5).max(50),
    phone: z.string(),
    email: z.string().email(),
    type: z.string(),
    message: z.string()
  })