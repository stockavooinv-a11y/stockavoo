import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * STORE MANAGEMENT API
 *
 * RTK Query API for store management operations.
 * Handles CRUD operations for stores.
 */

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Store'],
  endpoints: (builder) => ({
    // Get all stores
    getAllStores: builder.query({
      query: () => '/stores',
      providesTags: ['Store'],
    }),

    // Get store by ID
    getStoreById: builder.query({
      query: (id) => `/stores/${id}`,
      providesTags: (result, error, id) => [{ type: 'Store', id }],
    }),

    // Create new store
    createStore: builder.mutation({
      query: (storeData) => ({
        url: '/stores',
        method: 'POST',
        body: storeData,
      }),
      invalidatesTags: ['Store'],
    }),

    // Update store
    updateStore: builder.mutation({
      query: ({ id, ...storeData }) => ({
        url: `/stores/${id}`,
        method: 'PUT',
        body: storeData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Store', id }, 'Store'],
    }),

    // Delete/Deactivate store
    deleteStore: builder.mutation({
      query: (id) => ({
        url: `/stores/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Store'],
    }),

    // Bulk create stores
    bulkCreateStores: builder.mutation({
      query: (stores) => ({
        url: '/stores/bulk',
        method: 'POST',
        body: { stores },
      }),
      invalidatesTags: ['Store'],
    }),
  }),
});

// Export hooks for components to use
export const {
  useGetAllStoresQuery,
  useGetStoreByIdQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useBulkCreateStoresMutation,
} = storeApi;
