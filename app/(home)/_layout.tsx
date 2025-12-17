import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useTheme } from "@/context/ThemeContext";

export default function HomeLayout() {
  const { isSignedIn } = useAuth();
  const { isDark } = useTheme();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? "#1A1A1A" : "#F9FAFB" },
        animation: "fade",
      }}
    />
  );
}
