import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Incorrect email or password." }),
  _action: z.union([z.literal("google"), z.literal("password")]),
});
