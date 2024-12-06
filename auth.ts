import NextAuth from "next-auth"
// import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"

import bcryptjs from 'bcryptjs'

import { loginSchema } from "@/schema"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt"},
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials)

                if(validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await prisma.user.findUnique({ where: { email } });

                    if(!user || !user.password) return null

                    const passwordsMatch = await bcryptjs.compare(password, user.password)

                    if(passwordsMatch) return user;
                }
                
                return null
            }
        })
    ],
})