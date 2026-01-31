import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * USER MANAGEMENT API
 *
 * RTK Query API for user management operations.
 * Handles CRUD operations for users with RBAC.
 */

export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Get all users in the business
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),

    // Get current user profile
    getCurrentUser: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Create/Invite new user
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User'],
    }),

    // Update own profile
    updateOwnProfile: builder.mutation({
      query: (userData) => ({
        url: '/users/me',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Delete/Deactivate user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks for components to use
export const {
  useGetAllUsersQuery,
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateOwnProfileMutation,
  useDeleteUserMutation,
} = userApi;
