import { rest } from "msw";
import { Repo } from "../types/github";

const MOCK_API_BASE = "https://api.github.com";

export const mockRepos: Repo[] = [
  {
    id: 1,
    name: "React",
    owner: { login: "facebook", avatar_url: "" },
    description: "A JS library",
    full_name: "facebook/react",
  },
  {
    id: 2,
    name: "VSCode",
    owner: { login: "microsoft", avatar_url: "" },
    description: "A code editor",
    full_name: "microsoft/vscode",
  },
];

export const handlers = [
  // Mock for the initial list of repositories
  rest.get(`${MOCK_API_BASE}/repositories`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockRepos));
  }),

  // Mock for the search functionality
  rest.get(`${MOCK_API_BASE}/search/repositories`, (req, res, ctx) => {
    const mockSearchResults = { items: [mockRepos[0]] }; // Just return 'React' for any search
    return res(ctx.status(200), ctx.json(mockSearchResults));
  }),
];

// Handler for when the API should return no data
export const emptyHandlers = [
  rest.get(`${MOCK_API_BASE}/repositories`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
];
