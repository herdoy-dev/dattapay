import { View, Text } from "react-native";

type CircleSize = "sm" | "md" | "lg" | "xl";
type CircleColor = "gray" | "primary" | "primary-solid" | "primary-transparent";

interface IconCircleProps {
  icon: React.ReactNode;
  size?: CircleSize;
  color?: CircleColor;
  className?: string;
}

const sizeStyles: Record<CircleSize, { container: string; text: string }> = {
  sm: { container: "w-10 h-10", text: "text-lg" },
  md: { container: "w-12 h-12", text: "text-lg" },
  lg: { container: "w-16 h-16", text: "text-3xl" },
  xl: { container: "w-24 h-24", text: "text-5xl" },
};

const colorStyles: Record<CircleColor, string> = {
  gray: "bg-gray-100 dark:bg-gray-800",
  primary: "bg-primary-100 dark:bg-primary-900",
  "primary-solid": "bg-primary-500",
  "primary-transparent": "bg-primary-500/20",
};

export default function IconCircle({
  icon,
  size = "md",
  color = "gray",
  className = "",
}: IconCircleProps) {
  const sizeStyle = sizeStyles[size];
  const colorStyle = colorStyles[color];

  const containerClasses = [
    sizeStyle.container,
    colorStyle,
    "rounded-full items-center justify-center",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <View className={containerClasses}>
      {typeof icon === "string" ? (
        <Text className={sizeStyle.text}>{icon}</Text>
      ) : (
        icon
      )}
    </View>
  );
}
