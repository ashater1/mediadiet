import { useLocation } from "@remix-run/react";
import { useState } from "react";

export function useIsAuthPage() {
  const location = useLocation();
  const authPaths = ["/login", "/signup"];
  return authPaths.includes(location.pathname);
}

export function usePasswordValidator() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isMatching: password.length > 0 && password === confirmPassword,
    isValidLength: password.length >= 8,
    includesSymbol:
      /[\?\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\;\:\'\"\,\.\<\>\/\|\`\~]/.test(
        password
      ),
    includesNumber: /\d/.test(password),
    includesUppercase: password.toLowerCase() !== password,
  };
}
