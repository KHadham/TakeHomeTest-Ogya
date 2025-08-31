import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Repo, UserProfile } from "../../types/github";

export const githubApiSlice = createApi({
  reducerPath: "githubApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.github.com/" }),
  endpoints: (builder) => ({
    getPublicRepositories: builder.query<Repo[], number>({
      query: (since = 0) => `repositories?since=${since}`,
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        // Prevent duplicates when merging
        const existingIds = new Set(currentCache.map((repo) => repo.id));
        newItems.forEach((repo) => {
          if (!existingIds.has(repo.id)) {
            currentCache.push(repo);
          }
        });
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    // The change is in the line below
    searchRepositories: builder.query<Repo[], string>({
      query: (query) => `search/repositories?q=${query}`,
      // This function extracts the array from the API's object response
      transformResponse: (response: { items: Repo[] }) => response.items,
    }),
    getUserProfile: builder.query<UserProfile, string>({
      query: (username) => `users/${username}`,
    }),
  }),
});

export const {
  useGetPublicRepositoriesQuery,
  useLazyGetPublicRepositoriesQuery,
  useSearchRepositoriesQuery,
  useGetUserProfileQuery,
} = githubApiSlice;
