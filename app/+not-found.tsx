import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconCircle from "@/components/ui/IconCircle";
import ThemeButton from "@/components/ui/ThemeButton";

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#121212]">
      <Stack.Screen options={{ title: "Not Found", headerShown: false }} />
      <View className="flex-1 items-center justify-center px-6">
        <IconCircle icon="🔍" size="xl" color="gray" className="mb-6" />
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Page not found
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-400 text-center mb-8">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Link href="/" asChild>
          <ThemeButton variant="primary" fullWidth={false} onPress={() => {}}>
            Go to Home
          </ThemeButton>
        </Link>
      </View>
    </SafeAreaView>
  );
}
