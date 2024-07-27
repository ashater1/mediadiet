import { z } from "zod";

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password is too short (minimum 8 characters)" })
    .max(50, { message: "Password is too long (maximum 50 characters)" })
    .refine(
      (data) =>
        /[\?\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\;\:\'\"\,\.\<\>\/\|\`\~]/.test(
          data
        ) &&
        /\d/.test(data) &&
        data.toLowerCase() !== data,
      {
        path: ["password"],
        message: "Password does not meet minimum requirements",
      }
    ),
  confirmPassword: z.string(),
});
