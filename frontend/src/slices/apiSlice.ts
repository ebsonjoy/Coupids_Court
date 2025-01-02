import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ 
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/',
  credentials: 'include',
});

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api', // 
  baseQuery,
  tagTypes: ['User',],
  endpoints: () => ({}), 
});
