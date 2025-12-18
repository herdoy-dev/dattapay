import ThemeButton from "@/components/ui/ThemeButton";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { Shield } from "lucide-react-native";
import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface KYCStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export default function CompleteKYCScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmitKYC = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call for KYC submission
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      // console.log("hello");

      // Navigate to home after successful KYC
      router.replace("/(home)");
    } catch (err: any) {
      setError(err.message || "Failed to submit KYC verification");
      console.error("KYC submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipForNow = () => {
    // Allow users to skip KYC and go to home
    // They can complete it later from account settings
    router.replace("/(home)");
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#121212]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-6">
            {/* Header */}
            <View className="mb-8">
              <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                <Shield size={32} color="#005AEE" />
              </View>
              <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                KYC Verification
              </Text>
              <Text className="text-base text-gray-600 dark:text-gray-400">
                Complete your identity verification to unlock all features and
                higher transaction limits.
              </Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <Text className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Info Box */}
            <View className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8">
              <Text className="text-blue-800 dark:text-blue-300 text-sm font-medium mb-1">
                Why is this needed?
              </Text>
              <Text className="text-blue-700 dark:text-blue-400 text-sm">
                KYC verification helps us comply with financial regulations and
                protect your account from unauthorized access.
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="mb-6">
              <ThemeButton
                variant="ghost"
                onPress={handleSkipForNow}
                className="mt-3"
              >
                Skip for now
              </ThemeButton>
              <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                You can complete KYC later from your account settings
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
