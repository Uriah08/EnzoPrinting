import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_URL
    }),
    tagTypes: [],
    endpoints: (build) => ({
        createUser: build.mutation({
            query: (userData) => ({
                url: "/api/users",
                method: "POST",
                body: userData,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }),
        loginUser: build.mutation({
            query: (userData) => ({
                url: "/api/login",
                method: "POST",
                body: userData,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        })
    })
})

export const {
    useCreateUserMutation,
    useLoginUserMutation
} = api