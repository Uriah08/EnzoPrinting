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