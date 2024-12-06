import { DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession["user"] & {
    role: 'admin' | 'user'
}
declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}