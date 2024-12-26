import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Quote } from '@prisma/client';

type Product = {
    status: string;
    id: string;
    image: string;
    name: string;
    description: string;
    quantity: string
    price: string;
    category: string;
    highlight: boolean
    createdAt: Date;
    updatedAt: Date;
}

export type Purchase = {
    id: string;
    cartTotal: string;
    userId: string;
    createdAt: Date;
    status: string;
    new: boolean;
    received: boolean
    transaction: string
    items: Product[]
    user: {
        image?: string
        email: string
    }
}

type PurchaseResponse = {
    items: Purchase[];
}

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

type Cart = {
    id: string;
    description: string
    facebook: string
    productId: string
    quantity: string
    userId: string
    createdAt: Date
    product: {
        id: string
        name: string
        category: string
        image: string
        price: string
    }
}

type CartResponse = {
    cart: Cart[]
}

type PurchaseStatusCounts = {
    [key: string]: number;
  };
 
  type TopUser = {
    userId: string;
    name: string;
    email: string;
    image?: string;
    totalContribution: number;
  };

  
type AdminDashboardResponse = {
    data: {
      productCount: number;
      feedbackCount: number;
      quoteCount: number;
      purchaseCount: number;
      purchaseStatus: PurchaseStatusCounts;
      categoryCountMap: { [key: string]: number };
      topUsers: TopUser[];
      dailySummary: Array<{
        date: string;
        order: number;
      }>;
    };
    message: string;
    success: boolean;
  };

interface GetUserDashboardResponse {
    message: string;
    success: boolean;
    data: {
        cartItemCount: number;
        pendingItemsCount: number
        total: number
        cart: number
        dailySummary: Array<{
            date: string;
            order: number;
          }>;
    }
  }

  interface QuoteResponse {
    quotes: Quote[];
  }

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_URL
    }),
    tagTypes: ['Feedback','Product', 'Cart','Item','Quote'],
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
        highlightProduct: build.mutation({
            query: ({id, status}) => ({
                url: `/api/product`,
                method: 'PATCH',
                body: {id, status},
            }),
            invalidatesTags: ['Product']
        }),
        getHighlightProduct: build.query<ProductResponse, void>({
            query: () => ({
                url: `/api/product/highlight`,
                method: 'GET',
            }),
            providesTags: ['Product']
        }),
        createCart: build.mutation({
            query: (cart) => ({
                url: '/api/cart',
                method: 'POST',
                body: cart,
                headers: {
                    "Content-Type" : "application/json"
                }
            }),
            invalidatesTags: ['Cart']
        }),
        getCart: build.query<CartResponse, string>({
            query: (id) => ({
                url: `/api/cart/${id}`,
                method: 'GET'
            }),
            providesTags: ['Cart']
        }),
        deleteCart: build.mutation({
            query: (id) => ({
                url: `/api/cart/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Cart']
        }),
        updateCart: build.mutation({
            query: (cartData) => ({
                url: '/api/cart/many',
                method: 'POST',
                body: cartData,
                headers: {
                    "Content-Type" : "application/json"
                }
            }),
            invalidatesTags: ['Cart']
        }),
        deleteAllCart: build.mutation({
            query: (id) => ({
                url: `/api/cart/many/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Cart']
        }),
        purchase: build.mutation({
            query: (purchaseData) => ({
                url: '/api/purchase',
                method: 'POST',
                body: purchaseData,
                headers: {
                    "Content-Type" : "application/json"
                }
            })
        }),
        createQuote: build.mutation({
            query: (quoteData) => ({
                url: '/api/quote',
                method: 'POST',
                body: quoteData,
                headers: {
                    "Content-Type": "application/json"
                }
            }),
            invalidatesTags: ['Quote']
        }),
        sendQuote: build.mutation({
            query: (quoteData) => ({
                url: '/api/send',
                method: 'POST',
                body: quoteData,
                headers: {
                    "Content-Type": "application/json"
                }
            }),
            invalidatesTags: ['Quote']
        }),
        getQuotes: build.query<QuoteResponse, void>({
            query: () => ({
                url: '/api/quote',
                method: 'GET'
            }),
            providesTags: ['Quote']
        }),
        getItemsPurchase: build.query<PurchaseResponse, string>({
            query: (transaction) => ({
                url: `/api/purchase/transaction/${transaction}`,
                method: 'GET',
            }),
            providesTags: ['Item']
        }),
        updateItemStatus: build.mutation({
            query: ({ id, status }) => ({
                url: `/api/purchase`,
                method: 'PATCH',
                body: { id, status },
            }),
            invalidatesTags: ['Item']
        }),
        getOrder: build.query({
            query: (id) => ({
                url: `/api/purchase/${id}`,
                method: 'GET'
            })
        }),
        updatePurchaseTransaction: build.mutation({
            query: ({id,transaction}) => ({
                url: `/api/purchase/transaction`,
                method: 'PATCH',
                body: {id, transaction}
            }),
            invalidatesTags: ['Item']
        }),
        getUserOrder: build.query<PurchaseResponse, string>({
            query: (id) => ({
                url: `/api/purchase/user/${id}`,
                method: 'GET'
            }),
            providesTags: ['Item']
        }),
        updateOrderReceived: build.mutation({
            query: (id) => ({
                url: `/api/purchase/user/item/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['Item']
        }),
        getUserHistory: build.query<PurchaseResponse, string>({
            query: (id) => ({
                url: `/api/purchase/user/item/${id}`,
                method: 'GET'
            }),
            providesTags: ['Item']
        }),
        getAdminDashboard: build.query<AdminDashboardResponse, void>({
            query: () => ({
                url: '/api/admin/dashboard',
                method: 'GET'
            }),
            providesTags: ['Feedback','Product','Cart','Item','Quote']
        }),
        getUserDashboard: build.query<GetUserDashboardResponse, string>({
            query: (id) => ({
                url: `/api/users/dashboard/${id}`,
                method: 'GET'
            }),
            providesTags: ['Product','Cart','Item','Cart']
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
    useHighlightProductMutation,
    useGetHighlightProductQuery,
    useCreateCartMutation,
    useGetCartQuery,
    useDeleteCartMutation,
    useUpdateCartMutation,
    useDeleteAllCartMutation,
    usePurchaseMutation,
    useCreateQuoteMutation,
    useSendQuoteMutation,
    useGetQuotesQuery,
    useGetItemsPurchaseQuery,
    useUpdateItemStatusMutation,
    useLazyGetOrderQuery,
    useUpdatePurchaseTransactionMutation,
    useGetUserOrderQuery,
    useUpdateOrderReceivedMutation,
    useGetUserHistoryQuery,
    useGetAdminDashboardQuery,
    useGetUserDashboardQuery
} = api