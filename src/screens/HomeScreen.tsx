import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  getPublicRepositories,
  searchPublicRepositories,
} from "../api/githubAPI";
import { Repo } from "../types/github";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [since, setSince] = useState<number>(0); // For pagination
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Effect for handling debounced search
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
        const searchResults = await searchPublicRepositories(searchQuery);
        setRepos(searchResults);
        setIsLoading(false);
      } else if (searchQuery.length === 0) {
        // If search is cleared, fetch the initial list again
        fetchInitialRepos();
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Function to fetch the very first page of repositories
  const fetchInitialRepos = async () => {
    setIsLoading(true);
    const initialRepos = await getPublicRepositories(0);
    setRepos(initialRepos);
    if (initialRepos.length > 0) {
      setSince(initialRepos[initialRepos.length - 1].id);
    }
    setIsLoading(false);
  };

  // Initial data load on component mount
  useEffect(() => {
    fetchInitialRepos();
  }, []);

  // Function for infinite scroll
  const handleLoadMore = useCallback(async () => {
    // Don't fetch more if we are already loading or if a search is active
    if (isLoading || searchQuery) return;

    setIsLoading(true);
    const newRepos = await getPublicRepositories(since);
    if (newRepos.length > 0) {
      setRepos((prevRepos) => [...prevRepos, ...newRepos]);
      setSince(newRepos[newRepos.length - 1].id);
    }
    setIsLoading(false);
  }, [isLoading, since, searchQuery]);

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
      <FlatList
        data={repos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" /> : null
        }
        ListEmptyComponent={
          !isLoading ? (
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
