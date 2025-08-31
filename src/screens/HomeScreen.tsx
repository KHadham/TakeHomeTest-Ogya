import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { Repo } from "../types/github";
import {
  useGetPublicRepositoriesQuery,
  useSearchRepositoriesQuery,
} from "../store/slices/githubSlice";

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function HomeScreen() {
  const [since, setSince] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const params = useLocalSearchParams<{ sortBy?: "asc" | "desc" }>();

  // RTK Query hook for the initial list and infinite scroll
  const {
    data: repoList,
    isLoading: isListLoading,
    isFetching: isListFetching,
  } = useGetPublicRepositoriesQuery(since);

  // RTK Query hook for search. It will only run when the query is long enough.
  const { data: searchResults, isLoading: isSearchLoading } =
    useSearchRepositoriesQuery(debouncedSearchQuery, {
      skip: debouncedSearchQuery.length < 3,
    });

  useEffect(() => {
    if (params.sortBy === "asc" || params.sortBy === "desc") {
      setSortOrder(params.sortBy);
    }
  }, [params.sortBy]);

  const handleLoadMore = () => {
    if (isListFetching || debouncedSearchQuery) return;
    // To fetch the next page, we just need to update the `since` parameter
    if (repoList && repoList.length > 0) {
      setSince(repoList[repoList.length - 1].id);
    }
  };

  // Determine which data to display and handle loading states
  const isLoading = isListLoading || isSearchLoading;
  const repos = debouncedSearchQuery.length > 2 ? searchResults : repoList;

  // Memoized sorting logic remains the same
  const sortedRepos = useMemo(() => {
    if (!sortOrder || !repos) return repos || [];
    return [...repos].sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
  }, [repos, sortOrder]);

  const renderItem = ({ item }: { item: Repo }) => (
    <Link href={`/user/${item.owner.login}`} asChild>
      <TouchableOpacity style={styles.itemContainer}>
        <Text style={styles.repoName}>{item.name}</Text>
        <Text style={styles.ownerLogin}>{item.owner.login}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for repositories..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Link href="/modal" asChild>
        <Button title="Sort & Filter" />
      </Link>
      <FlatList
        data={sortedRepos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="large" testID="activity-indicator" />
          ) : null
        }
        ListEmptyComponent={
          !isLoading && repos && repos.length === 0 ? (
            <View style={styles.centeredMessage}>
              <Text>No Data Found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  searchBar: {
    padding: 12,
    margin: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  repoName: { fontSize: 18, fontWeight: "bold" },
  ownerLogin: { fontSize: 14, color: "gray", marginTop: 4 },
  centeredMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
