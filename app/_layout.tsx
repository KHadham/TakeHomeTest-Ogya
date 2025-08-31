import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="user/[username]"
            options={{ title: "User Profile" }}
          />
        </Stack>
      </GestureHandlerRootView>
    </Provider>
  );
}
