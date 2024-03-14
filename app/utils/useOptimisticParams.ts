import { useNavigation, useSearchParams } from "@remix-run/react";

export function useOptimisticParams() {
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  return {
    isLoading: navigation.state !== "idle" && !!navigation.formData,

    getParam: (name: string) =>
      navigation.formData?.get(name) ?? searchParams.get(name),

    getAllParams: (name: string) =>
      navigation.formData?.getAll(name) ?? searchParams.getAll(name),
  };
}
