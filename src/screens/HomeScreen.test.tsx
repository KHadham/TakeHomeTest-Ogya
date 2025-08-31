import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { Provider } from "react-redux";
import { store } from "../store"; // Your actual store
import HomeScreen from "./HomeScreen";
import { server } from "../mocks/server";
import { emptyHandlers, mockRepos } from "../mocks/handlers";

// We need to wrap our component in the Redux Provider for tests
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

// Mock the Link component from expo-router
jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  Link: ({ children }: { children: React.ReactNode }) => children,
  useLocalSearchParams: () => ({}),
}));

describe("HomeScreen", () => {
  it("renders a loading indicator and then displays repositories", async () => {
    render(<HomeScreen />, { wrapper: AllTheProviders });

    // Initially, the loading indicator from the footer should be visible
    expect(screen.getByTestId("activity-indicator")).toBeTruthy(); // Add testID="activity-indicator" to your ActivityIndicator

    // Wait for the API call to resolve and the list to be populated
    const repoName = await screen.findByText(mockRepos[0].name);
    expect(repoName).toBeTruthy();
    expect(screen.getByText(mockRepos[1].name)).toBeTruthy();
  });

  it("displays search results when user types in the search bar", async () => {
    render(<HomeScreen />, { wrapper: AllTheProviders });

    // Wait for initial list to load
    await screen.findByText(mockRepos[1].name);

    const searchInput = screen.getByPlaceholderText(/search for repositories/i);
    // Simulate typing "React" into the search bar
    fireEvent.changeText(searchInput, "React");

    // Wait for the debounced search to complete and find the search result
    // The mock handler for search only returns "React"
    await waitFor(() => {
      expect(screen.getByText("React")).toBeTruthy();
      expect(screen.queryByText("VSCode")).toBeNull(); // The other repo should disappear
    });
  });

  it('displays "No Data Found" when the API returns an empty list', async () => {
    // Override the default mock handler for this specific test
    server.use(...emptyHandlers);

    render(<HomeScreen />, { wrapper: AllTheProviders });

    // Wait for the "No Data Found" message to appear
    const noDataMessage = await screen.findByText(/no data found/i);
    expect(noDataMessage).toBeTruthy();
  });
});
