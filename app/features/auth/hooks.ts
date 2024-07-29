import { useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

export function useIsAuthPage() {
  const location = useLocation();
  const authPaths = [
    "/login",
    "/signup",
    "/reset-password",
    "/forgot-password",
    "/reset-password/authenticate",
  ];
  return authPaths.includes(location.pathname);
}

export function usePasswordValidator() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (password.length === 0) {
      setConfirmPassword("");
    }
  }, [password]);

  const isMatching = password.length > 0 && password === confirmPassword;
  const isValidLength = password.length >= 8;
  const includesSymbol =
    /[\?\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\;\:\'\"\,\.\<\>\/\|\`\~]/.test(
      password
    );
  const includesNumber = /\d/.test(password);
  const includesUppercase = password.toLowerCase() !== password;

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isMatching,
    isValidLength,
    includesSymbol,
    includesNumber,
    includesUppercase,
    isValidPassword:
      isValidLength && includesNumber && includesUppercase && includesSymbol,
  };
}
