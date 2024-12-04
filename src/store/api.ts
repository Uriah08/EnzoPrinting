import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'url'
    }),
    tagTypes: [],
    endpoints: (build) => ({
        createFeedback: build.mutation({
            query: (userData) => ({
                url: "/auth/register",
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
    useCreateFeedbackMutation
} = api