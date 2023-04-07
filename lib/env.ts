import { z } from "zod";
const envSchema = z.object({
  NOTION_TOKEN: z.string().optional(),
  NOTION_DATABASE_ID: z.string().optional()
})
export function getEnv() {
  return //envSchema.parse(process.env)
}
