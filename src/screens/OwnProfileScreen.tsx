import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getUserProfile } from "../api/githubAPI";
import { UserProfile } from "../types/github";

const MY_USERNAME = "expo"; // Hardcode a username to simulate "your" profile

export default function OwnProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const data = await getUserProfile(MY_USERNAME);
        setProfile(data);
      } catch (error) {
        Alert.alert("Error", "Could not fetch profile data.");
      }
    };
    fetchMyProfile();
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions for this."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLocalAvatarUri(result.assets[0].uri);
    }
  };

  if (!profile) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  const avatarSource = localAvatarUri
    ? { uri: localAvatarUri }
    : { uri: profile.avatar_url };

  return (
    <View style={styles.container}>
      <Image source={avatarSource} style={styles.avatar} />
      <Button title="Change Profile Picture" onPress={handlePickImage} />
      <Text style={styles.name}>{profile.name || profile.login}</Text>
      <Text style={styles.username}>@{profile.login}</Text>
    </View>
  );
}

// You can reuse the styles from UserProfileScreen or create new ones
const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  avatar: { width: 150, height: 150, borderRadius: 75, marginVertical: 20 },
  name: { fontSize: 24, fontWeight: "bold" },
  username: { fontSize: 18, color: "gray" },
});
