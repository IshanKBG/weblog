import { z } from "zod";
const envSchema = z.object({
  NOTION_TOKEN: z.string().nonempty(),
  NOTION_DATABASE_ID: z.string().nonempty()
})
export function getEnv() {
  return envSchema.parse(process.env)
}
