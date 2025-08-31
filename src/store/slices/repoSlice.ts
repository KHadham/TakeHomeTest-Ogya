import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Repo } from "../../types/github";

interface RepoState {
  list: Repo[];
  since: number;
  isLoading: boolean;
  error: string | null;
  sortOrder: "asc" | "desc" | null;
}

const initialState: RepoState = {
  list: [],
  since: 0,
  isLoading: false,
  error: null,
  sortOrder: null,
};

const repoSlice = createSlice({
  name: "repositories",
  initialState,
  reducers: {
    // Actions that Sagas will listen for
    fetchReposStart: (state) => {
      state.isLoading = true;
    },
    searchReposStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.list = []; // Clear list for a new search
    },

    // Actions that update the state with data from Sagas
    fetchReposSuccess: (
      state,
      action: PayloadAction<{ repos: Repo[]; since: number }>
    ) => {
      state.isLoading = false;
      const newRepos = action.payload.repos.filter(
        (repo) => !state.list.some((existing) => existing.id === repo.id)
      );
      state.list = [...state.list, ...newRepos];
      state.since = action.payload.since;
    },
    searchReposSuccess: (state, action: PayloadAction<Repo[]>) => {
      state.isLoading = false;
      state.list = action.payload;
    },
    fetchReposFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Synchronous action for sorting
    setSortOrder: (state, action: PayloadAction<"asc" | "desc" | null>) => {
      state.sortOrder = action.payload;
    },
  },
});

export const {
  fetchReposStart,
  searchReposStart,
  fetchReposSuccess,
  searchReposSuccess,
  fetchReposFailure,
  setSortOrder,
} = repoSlice.actions;

export default repoSlice.reducer;
