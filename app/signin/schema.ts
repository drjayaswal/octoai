import { z } from "zod"
export const signinSchema = z.object({
    email: z.string().min(1, "Required").email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
});