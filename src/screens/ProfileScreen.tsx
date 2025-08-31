import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getUserProfile } from "../api/githubAPI";
import { UserProfile } from "../types/github";

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile(username);
        setProfile(data);
      } catch (err) {
        setError("User not found.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error || !profile) {
    return (
      <View style={styles.centered}>
        <Text>{error || "No Data Found"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
      <Text style={styles.name}>{profile.name || profile.login}</Text>
      <Text style={styles.username}>@{profile.login}</Text>
      <View style={styles.statsContainer}>
        <Text>{profile.followers} Followers</Text>
        <Text>·</Text>
        <Text>{profile.following} Following</Text>
        <Text>·</Text>
        <Text>{profile.public_repos} Repos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  avatar: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: "bold" },
  username: { fontSize: 18, color: "gray", marginBottom: 20 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
});
