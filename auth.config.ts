import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from "@/lib/db"
import { passwordMatch } from '@/schema'

import { loginSchema } from '@/schema'

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials)

                if(validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await prisma.user.findUnique({ where: { email } });

                    if(!user || !user.password) return null

                    const passwordsMatch = await passwordMatch(password, user.password)

                    if(passwordsMatch) return user;
                }
                
                return null
            }
        })
    ],
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig