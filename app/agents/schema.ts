import { z } from "zod";

export const createAgentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  instructions: z.string().min(5, "Instructions must be at least 5 characters"),
});