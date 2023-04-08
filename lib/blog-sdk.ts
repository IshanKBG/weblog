import { client } from "@/lib/notion";
import { getEnv } from "@/lib/env";
import { Client } from "@notionhq/client";
import { PageObjectResponse, PartialPageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { PostMeta } from "@/models/posts";
interface ClientOpts {
  client: Client
  database_id: string
}
type ExtendNotionType = PageObjectResponse | PartialPageObjectResponse & {
  properties: Object
}
export class BlogClient {
  #client: Client;
  #database_id: string;
  constructor(opts: ClientOpts) {
    this.#client = opts.client;
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
      return PostMeta.parse({
        title: res.properties.title.title[0].plain_text,
        draft: res.properties.draft.checkbox,
        desc: res.properties?.desc?.rich_text[0].plain_text,
        postedAt: new Date(res.properties.postedAt.date.start),
        slug: res.properties.slug.rich_text[0].plain_text,
      })
    })
  }
}
export const blog = new BlogClient({
  client,
  database_id: getEnv().NOTION_DATABASE_ID
});
