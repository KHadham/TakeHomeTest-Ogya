import axios from "axios";
import { Repo, UserProfile } from "../types/github";

const API_BASE = "https://api.github.com";

// Function for the initial list and infinite scroll
export const getPublicRepositories = async (since: number): Promise<Repo[]> => {
  const response = await axios.get(`${API_BASE}/repositories`, {
    params: { since },
  });
  return response.data;
};

// Function for the search feature
export const searchPublicRepositories = async (
  query: string
): Promise<Repo[]> => {
  if (!query) return [];
  const response = await axios.get(`${API_BASE}/search/repositories`, {
    params: { q: query },
  });
  return response.data.items;
};

export const getUserProfile = async (
  username: string
): Promise<UserProfile> => {
  const response = await axios.get(`${API_BASE}/users/${username}`);
  return response.data;
};
