import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ 
  baseUrl: 'https://api.coupidscourt.site/',
  credentials: 'include',
});

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api', // 
  baseQuery,
  tagTypes: ['User',],
  endpoints: () => ({}), 
});
