import { z } from "zod";
import { getEnv } from "@/lib/env";
const blogMetaSchema = z.object({
  title: z.string(),
  posted_At: z
    .string()
    .transform((v) => new Date(v))
    .pipe(z.date()),
  tags: z.string().array(),
  slug: z.string(),
})
type BlogSchema = z.infer<typeof blogMetaSchema>
export class BlogClient {
  #token: string;
  #database_id: string;
  constructor(private token: string, private database_id: string) {
    this.#token = token
    this.#database_id = database_id
  }
  async listAllPosts(): Promise<Array<BlogSchema>> {
    let res = await fetch(`https://api.notion.com/v1/databases/${this.#database_id}/query`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${this.#token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        filter: {
          and: [
            { property: 'published', checkbox: { equals: true } },

          ],
        },
      }),
      next: {
        revalidate: 9
      }
    })
    const posts = await res.json();
    const allPosts = posts.results
    return allPosts.map((post: any) => {
      return this.getPageMetaData(post);
    });
  }
  getPageMetaData(post: any): BlogSchema {
    const getTags = (tags: any) => {
      const allTags = tags.map((tag: any) => {
        return tag.name;
      });

      return allTags;
    };

    return {
      title: post.properties.title.title[0].plain_text,
      tags: getTags(post.properties.tags.multi_select),
      posted_At: new Date(post.properties.posted_At.last_edited_time),
      slug: post.properties.slug.rich_text[0].plain_text,
    }
  }
}
export const blog = new BlogClient(process.env.NOTION_TOKEN!, process.env.NOTION_DATABASE_ID!);

