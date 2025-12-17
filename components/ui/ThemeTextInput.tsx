import { TextInput, View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type InputVariant = "default" | "email" | "password" | "code";

interface ThemeTextInputProps {
  variant?: InputVariant;
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const variantConfig: Record<
  InputVariant,
  {
    keyboardType?: "default" | "email-address" | "number-pad";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoComplete?: "email" | "password" | "off";
    secureTextEntry?: boolean;
    textAlign?: "left" | "center";
    additionalStyles?: string;
  }
> = {
  default: {
    keyboardType: "default",
    autoCapitalize: "sentences",
    autoComplete: "off",
    secureTextEntry: false,
    textAlign: "left",
  },
  email: {
    keyboardType: "email-address",
    autoCapitalize: "none",
    autoComplete: "email",
    secureTextEntry: false,
    textAlign: "left",
  },
  password: {
    keyboardType: "default",
    autoCapitalize: "none",
    autoComplete: "password",
    secureTextEntry: true,
    textAlign: "left",
  },
  code: {
    keyboardType: "number-pad",
    autoCapitalize: "none",
    autoComplete: "off",
    secureTextEntry: false,
    textAlign: "center",
    additionalStyles: "tracking-widest",
  },
};

export default function ThemeTextInput({
  variant = "default",
  label,
  placeholder,
  value,
  onChangeText,
  maxLength,
  disabled = false,
  error = false,
  className = "",
}: ThemeTextInputProps) {
  const { isDark } = useTheme();
  const config = variantConfig[variant];

  const placeholderColor = isDark ? "#6B7280" : "#9CA3AF";

  const baseStyles =
    "w-full h-14 px-4 bg-gray-50 dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white text-base";

  const borderStyles = error
    ? "border-red-500 dark:border-red-500"
    : "border-gray-200 dark:border-gray-700";

  const disabledStyles = disabled ? "opacity-50" : "";

  const inputClasses = [
    baseStyles,
    borderStyles,
    disabledStyles,
    config.additionalStyles,
    config.textAlign === "center" && "text-center",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <View>
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        onChangeText={onChangeText}
        keyboardType={config.keyboardType}
        autoCapitalize={config.autoCapitalize}
        autoComplete={config.autoComplete}
        secureTextEntry={config.secureTextEntry}
        maxLength={maxLength ?? (variant === "code" ? 6 : undefined)}
        editable={!disabled}
        className={inputClasses}
        accessibilityLabel={label}
      />
    </View>
  );
}
