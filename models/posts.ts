import { z } from "zod"
const PostMeta = z.object({
  title: z.string(),
  draft: z.boolean(),
  desc: z.string().optional(),
  slug: z.string().nonempty(),
  postedAt: z.date()
})
type PostMeta = z.infer<typeof PostMeta>
export {
  PostMeta
}
