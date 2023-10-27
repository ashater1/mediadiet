import { useNavigation } from "@remix-run/react";

export function useIsLoading({ value }: { value?: string | undefined }) {
  const navigation = useNavigation();

  if (value) {
    return (
      navigation.formData?.get("actionId") === value &&
      navigation.state !== "idle"
    );
  }

  return navigation.state !== "idle" && !!navigation.formData;
}
