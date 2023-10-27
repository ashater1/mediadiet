import { useNavigation } from "@remix-run/react";

export function useIsLoading({
  value,
  name = "actionId",
}: {
  value?: string[] | string | undefined;
  name?: string;
}) {
  const navigation = useNavigation();

  if (value) {
    if (Array.isArray(value)) {
      return (
        value.includes(navigation.formData?.get(name) as string) &&
        navigation.state !== "idle"
      );
    }

    return (
      navigation.formData?.get(name) === value && navigation.state !== "idle"
    );
  }

  return navigation.state !== "idle" && !!navigation.formData;
}
