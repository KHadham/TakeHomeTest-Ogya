import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function ModalScreen() {
  const router = useRouter();

  const handleSortPress = (order: "asc" | "desc") => {
    // 1. Update the params on the previous screen without remounting it
    router.setParams({ sortBy: order });

    // 2. Simply go back to close the modal
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sort Repositories</Text>
      <View style={styles.separator} />

      <View style={styles.buttonContainer}>
        <Button
          title="Sort by Name (Ascending)"
          onPress={() => handleSortPress("asc")}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Sort by Name (Descending)"
          onPress={() => handleSortPress("desc")}
        />
      </View>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: "#eee",
  },
  buttonContainer: { width: "80%", marginVertical: 10 },
});
