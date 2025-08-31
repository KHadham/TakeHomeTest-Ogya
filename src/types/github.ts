export interface RepoOwner {
  login: string;
  avatar_url: string;
}

export interface Repo {
  id: number;
  name: string;
  owner: RepoOwner;
  description: string | null;
  full_name: string;
}

export interface UserProfile {
  login: string;
  avatar_url: string;
  name: string | null;
  followers: number;
  following: number;
  public_repos: number;
}