import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '@prisma/client';

type ProductResponse = {
    product: Product[];
}

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
    tagTypes: ['Feedback','Product'],
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
        }),
        createProduct: build.mutation({
            query: (product) => ({
                url: '/api/product',
                method: 'POST',
                body: product,
                headers: {
                    "Content-Type": "application/json"
                }
            }),
            invalidatesTags: ['Product']
        }),
        getProduct: build.query<ProductResponse, void>({
            query: () => ({
                url: '/api/product',
                method: 'GET'
            }),
            providesTags: ['Product']
        }),
        deleteProduct: build.mutation({
            query: (id) => ({
                url: `/api/product/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Product']
        }),
        updateProduct: build.mutation({
            query: (product) => ({
                url: '/api/product/update',
                method: 'POST',
                body: product,
                headers: {
                    "Content-Type" : "application/json"
                }
            }),
            invalidatesTags: ['Product']
        }),
        createCart: build.mutation({
            query: (cart) => ({
                url: '/api/cart',
                method: 'POST',
                body: cart,
                headers: {
                    "Content-Type" : "application/json"
                }
            })
        })
    })
})

export const {
    useCreateUserMutation,
    useLoginUserMutation,
    useCreateFeedbackMutation,
    useGetFeedbackQuery,
    useDeleteFeedbackMutation,
    useCreateProductMutation,
    useGetProductQuery,
    useDeleteProductMutation,
    useUpdateProductMutation,
    useCreateCartMutation
} = api