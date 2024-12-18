import type { NextAuthConfig } from 'next-auth'

export default {
    providers: [],
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig