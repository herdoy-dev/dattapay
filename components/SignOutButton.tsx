import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text } from "react-native";
import ThemeButton from "@/components/ui/ThemeButton";

export default function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <ThemeButton
      variant="destructive"
      size="md"
      onPress={handleSignOut}
      leftIcon={<Text className="text-red-600 dark:text-red-400">↪</Text>}
    >
      Sign out
    </ThemeButton>
  );
}
