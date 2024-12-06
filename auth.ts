import NextAuth from "next-auth"
// import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"

import bcryptjs from 'bcryptjs'

import { findUserById, loginSchema } from "@/schema"

import authConfig from "./auth.config"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    callbacks: {
        async session({ token, session }){
            
            if(session.user && token.sub){
                session.user.id = token.sub
            }

            if(session.user && token.role){
                session.user.role = token.role as "admin" | "user"
            }

            return session
        },
        async jwt({ token }) {
            if(!token.sub) return token
            
            const user = await findUserById(token.sub)

            if(!user) return token

            token.role = user.role
            return token
        }
    },
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