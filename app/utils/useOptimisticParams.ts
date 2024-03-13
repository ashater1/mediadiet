import { useNavigation, useSearchParams } from "@remix-run/react";

export function useOptimisticParams() {
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  return {
    isLoading: navigation.state !== "idle" && !!navigation.formData,

    get: (name: string) =>
      navigation.formData?.get(name) ?? searchParams.get(name),

    getAll: (name: string) =>
      navigation.formData?.getAll(name) ?? searchParams.getAll(name),
  };
}
