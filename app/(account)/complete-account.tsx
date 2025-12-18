import ThemeButton from "@/components/ui/ThemeButton";
import ThemeTextInput from "@/components/ui/ThemeTextInput";
import { useTheme } from "@/context/ThemeContext";
import { CompleteAccountFormData, completeAccountSchema } from "@/schemas";
import { useUser } from "@clerk/clerk-expo";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOTAL_STEPS = 3;

// Fields for each step (used for per-step validation)
const STEP_FIELDS = {
  1: ["firstName", "lastName", "email"] as const,
  2: [
    "phoneNumberPrefix",
    "phoneNumber",
    "nationality",
    "dateOfBirth",
  ] as const,
  3: [
    "permanentAddress.addressLine1",
    "permanentAddress.city",
    "permanentAddress.state",
    "permanentAddress.country",
    "permanentAddress.postalCode",
  ] as const,
};

export default function CompleteAccountScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { isDark } = useTheme();

  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState("");

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CompleteAccountFormData>({
    resolver: yupResolver(completeAccountSchema),
    mode: "onChange",
    defaultValues: {
      clerkUserId: user?.id || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
      phoneNumberPrefix: "+1",
      phoneNumber: "",
      nationality: "",
      dateOfBirth: "",
      permanentAddress: {
        addressLine1: "",
        addressLine2: "",
        locality: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
    },
  });

  // Validate current step before proceeding
  const validateCurrentStep = async (): Promise<boolean> => {
    const fields = STEP_FIELDS[currentStep as keyof typeof STEP_FIELDS];
    const result = await trigger(fields as any);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      setServerError("");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setServerError("");
    }
  };

  // const onSubmit = async (data: CompleteAccountFormData) => {
  //   setIsLoading(true);
  //   setServerError("");

  //   try {
  //     // await submitAccountDetails(data as AccountFormData);
  //     // console.log(data);
  //     console.log("Okay");
  //     router.replace("/(account)/complete-kyc");
  //   } catch (err: any) {
  //     setServerError(err.message || "Failed to submit account details");
  //     console.error("Account submission error:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = () => router.replace("/(account)/complete-kyc");

  const renderStepIndicator = () => (
    <View className="flex-row justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <View key={step} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              step === currentStep
                ? "bg-primary"
                : step < currentStep
                  ? "bg-green-500"
                  : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                step <= currentStep ? "text-white" : "text-gray-500"
              }`}
            >
              {step}
            </Text>
          </View>
          {step < TOTAL_STEPS && (
            <View
              className={`w-12 h-1 mx-1 ${
                step < currentStep
                  ? "bg-green-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Personal Information
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Let's start with your basic details
      </Text>

      <View className="mb-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ThemeTextInput
              label="First Name"
              placeholder="Enter your first name"
              value={value}
              onChangeText={onChange}
              errorMessage={error?.message}
            />
          )}
        />
      </View>

      <View className="mb-4">
        <Controller
          name="lastName"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ThemeTextInput
              label="Last Name"
              placeholder="Enter your last name"
              value={value}
              onChangeText={onChange}
              errorMessage={error?.message}
            />
          )}
        />
      </View>

      <View className="mb-4">
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ThemeTextInput
              variant="email"
              label="Email Address"
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              errorMessage={error?.message}
            />
          )}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Contact & Identity
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        We need a few more details to verify your identity
      </Text>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone Number
        </Text>
        <View className="flex-row">
          <View className="w-24 mr-2">
            <Controller
              name="phoneNumberPrefix"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <ThemeTextInput
                  placeholder="+1"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={error?.message}
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Controller
              name="phoneNumber"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <ThemeTextInput
                  placeholder="Enter phone number"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={error?.message}
                />
              )}
            />
          </View>
        </View>
      </View>

      <View className="mb-4">
        <Controller
          name="nationality"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ThemeTextInput
              label="Nationality"
              placeholder="Enter your nationality"
              value={value}
              onChangeText={onChange}
              errorMessage={error?.message}
            />
          )}
        />
      </View>

      <View className="mb-4">
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <ThemeTextInput
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
                errorMessage={error?.message}
              />
              {!error && (
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Format: YYYY-MM-DD (e.g., 1990-01-15)
                </Text>
              )}
            </>
          )}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Permanent Address
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Please provide your residential address
      </Text>

      <View className="mb-4">
        <Controller
          name="permanentAddress.addressLine1"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ThemeTextInput
              label="Address Line 1"
              placeholder="Street address"
              value={value}
              onChangeText={onChange}
              errorMessage={error?.message}
            />
          )}
        />
      </View>

      <View className="mb-4">
        <Controller
          name="permanentAddress.addressLine2"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ThemeTextInput
              label="Address Line 2 (Optional)"
              placeholder="Apt, Suite, Unit, etc."
              value={value || ""}
              onChangeText={onChange}
              errorMessage={error?.message}
            />
          )}
        />
      </View>

      <View className="flex-row mb-4">
        <View className="flex-1 mr-2">
          <Controller
            name="permanentAddress.locality"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ThemeTextInput
                label="Locality"
                placeholder="Locality"
                value={value || ""}
                onChangeText={onChange}
                errorMessage={error?.message}
              />
            )}
          />
        </View>
        <View className="flex-1 ml-2">
          <Controller
            name="permanentAddress.city"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ThemeTextInput
                label="City"
                placeholder="City"
                value={value}
                onChangeText={onChange}
                errorMessage={error?.message}
              />
            )}
          />
        </View>
      </View>

      <View className="flex-row mb-4">
        <View className="flex-1 mr-2">
          <Controller
            name="permanentAddress.state"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ThemeTextInput
                label="State/Province"
                placeholder="State"
                value={value}
                onChangeText={onChange}
                errorMessage={error?.message}
              />
            )}
          />
        </View>
        <View className="flex-1 ml-2">
          <Controller
            name="permanentAddress.postalCode"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ThemeTextInput
                label="Postal Code"
                placeholder="Postal code"
                value={value}
                onChangeText={onChange}
                errorMessage={error?.message}
              />
            )}
          />
        </View>
      </View>

      <View className="mb-4">
        <Controller
          name="permanentAddress.country"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ThemeTextInput
              label="Country"
              placeholder="Country"
              value={value}
              onChangeText={onChange}
              errorMessage={error?.message}
            />
          )}
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  // Check if current step has any errors
  const hasStepErrors = () => {
    const fields = STEP_FIELDS[currentStep as keyof typeof STEP_FIELDS];
    return fields.some((field) => {
      const parts = field.split(".");
      if (parts.length === 1) {
        return !!(errors as any)[field];
      }
      return !!(errors as any)[parts[0]]?.[parts[1]];
    });
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
            <View className="mb-6">
              <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Complete Your Account
              </Text>
              <Text className="text-base text-gray-600 dark:text-gray-400">
                Step {currentStep} of {TOTAL_STEPS}
              </Text>
            </View>

            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Server Error Message */}
            {serverError ? (
              <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <Text className="text-red-600 dark:text-red-400 text-sm">
                  {serverError}
                </Text>
              </View>
            ) : null}

            {/* Current Step Content */}
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <View className="flex-row mt-8 mb-6">
              {currentStep > 1 && (
                <TouchableOpacity
                  onPress={handleBack}
                  className="flex-row items-center justify-center h-14 px-6 rounded-xl bg-gray-100 dark:bg-gray-800 mr-3"
                >
                  <ChevronLeft
                    size={20}
                    color={isDark ? "#FFFFFF" : "#374151"}
                  />
                  <Text className="text-gray-900 dark:text-white font-semibold ml-1">
                    Back
                  </Text>
                </TouchableOpacity>
              )}

              <View className="flex-1">
                {currentStep < TOTAL_STEPS ? (
                  <ThemeButton
                    variant="primary"
                    onPress={handleNext}
                    disabled={hasStepErrors()}
                    rightIcon={<ChevronRight size={20} color="#FFFFFF" />}
                  >
                    Continue
                  </ThemeButton>
                ) : (
                  <ThemeButton
                    variant="primary"
                    onPress={() => router.replace("/(account)/complete-kyc")}
                    disabled={hasStepErrors()}
                    loading={isLoading}
                  >
                    Submit & Continue to KYC
                  </ThemeButton>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
