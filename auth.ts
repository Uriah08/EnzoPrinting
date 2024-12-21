import NextAuth from "next-auth"
import { prisma } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { findUserById } from "@/schema"

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
})