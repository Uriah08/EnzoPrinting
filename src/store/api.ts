import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Feedback = {
    id: string;
    feedback: string;
    userId: string;
    createdAt: Date;
    user: {
      name: string;
      email: string;
      image: string | null;
    };
  };
  
  type FeedbacksResponse = {
    feedback: Feedback[];
  };
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_URL
    }),
    tagTypes: ['Feedback'],
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
        }),
        createFeedback: build.mutation({
            query: (feedback) => ({
                url: '/api/feedback',
                method: "POST",
                body: feedback,
                headers: {
                    "Content-Type": "application/json"
                },
            }),
            invalidatesTags: ['Feedback']
        }),
        getFeedback: build.query<FeedbacksResponse, void>({
            query: () => ({
                url: '/api/feedback',
                method: 'GET'
            }),
            providesTags: ['Feedback'],
        }),
        deleteFeedback: build.mutation<{ success: boolean; error?: string }, string>({
            query: (id) => ({
              url: `/api/feedback/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: ['Feedback']
        })
    })
})

export const {
    useCreateUserMutation,
    useLoginUserMutation,
    useCreateFeedbackMutation,
    useGetFeedbackQuery,
    useDeleteFeedbackMutation
} = api