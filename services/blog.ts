import { getEnv } from "@/lib/env";
import { Client } from "@notionhq/client";
import { PostMeta } from "@/models/posts";
import { fetcher } from "@/lib/fetcher";
import { SupportedFetch } from "@notionhq/client/build/src/fetch-types";
import { NotionToMarkdown } from "notion-to-md";

interface ClientOpts {
  token: string
  database_id: string
  fetcher: SupportedFetch
}
export class BlogClient {
  #client: Client;
  #database_id: string
  #n2m: NotionToMarkdown
  constructor(opts: ClientOpts) {
    this.#client = new Client({
      auth: opts.token,
      fetch: opts.fetcher
    });
    this.#n2m = new NotionToMarkdown({
      notionClient: this.#client
    })
    this.#database_id = opts.database_id
  }

  async getAllPosts() {
    let response = await this.#client.databases.query({
      database_id: this.#database_id,
      filter: {
        property: "draft",
        checkbox: {
          equals: true
        }
      }
    })
    let results = response.results
    return results.map((res: any) => {
      return this.generateMetaData(res);
    })
  }
  async getPost(slug: string) {
    const response = await this.#client.databases.query({
      database_id: this.#database_id,
      filter: {
        property: 'slug',
        rich_text: {
          contains: slug
        }
      },
      sorts: [
        {
          property: 'postedAt',
          direction: 'descending'
        }
      ],
    })
    const page = response.results[0]
    const mdBlock = await this.#n2m.pageToMarkdown(page.id)
    const markdown = this.#n2m.toMarkdownString(mdBlock)
    const post = this.generateMetaData(page);
    return {
      markdown,
      post
    }
  }
  generateMetaData(res: any) {
    return PostMeta.parse({
      title: res.properties.title.title[0].plain_text,
      draft: res.properties.draft.checkbox,
      desc: res.properties?.desc?.rich_text[0].plain_text,
      postedAt: new Date(res.properties.postedAt.date.start),
      slug: res.properties.slug.rich_text[0].plain_text,
    })
  }
}
export const blog = new BlogClient({
  token: getEnv().NOTION_TOKEN,
  database_id: getEnv().NOTION_DATABASE_ID,
  fetcher
});
