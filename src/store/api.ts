import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '@prisma/client';

type Purchase = {
    id: string;
    cartTotal: string;
    userId: string;
    createdAt: Date;
    status: string;
    new: boolean;
    transaction: string
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
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_URL
    }),
    tagTypes: ['Feedback','Product', 'Cart','Item'],
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
            })
        }),
        getItemsPurchase: build.query<PurchaseResponse, void>({
            query: () => ({
                url: '/api/purchase',
                method: 'GET'
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
    useCreateCartMutation,
    useGetCartQuery,
    useDeleteCartMutation,
    useUpdateCartMutation,
    useDeleteAllCartMutation,
    usePurchaseMutation,
    useCreateQuoteMutation,
    useGetItemsPurchaseQuery,
    useUpdateItemStatusMutation,
    useLazyGetOrderQuery,
    useUpdatePurchaseTransactionMutation
} = api