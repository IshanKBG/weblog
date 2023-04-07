import { z } from "zod";
import { getEnv } from "@/lib/env";
const blogMetaSchema = z.object({
  title: z.string(),
  postedAt: z.date(),
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
    const allPosts: NotionPageArray[] = posts.results
    console.log(JSON.stringify(posts.results))
    return allPosts.map((post: any) => {
      return blogMetaSchema.parse(this.getPageMetaData(post));
    });
  }
  getPageMetaData(post: NotionPageArray): BlogSchema {
    const getTags = (tags: any) => {
      const allTags = tags.map((tag: any) => {
        return tag.name;
      });

      return allTags;
    };

    return {
      title: post.properties.title.title[0].plain_text,
      tags: getTags(post.properties.tags.multi_select),
      postedAt: new Date(post.properties.postedAt.date.start),
      slug: post.properties.slug.rich_text[0].plain_text,
    }
  }
}
export const blog = new BlogClient(process.env.NOTION_TOKEN!, process.env.NOTION_DATABASE_ID!);
type NotionPageArray = {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: string;
    id: string;
  };
  last_edited_by: {
    object: string;
    id: string;
  };
  cover: null;
  icon: null;
  parent: {
    type: string;
    database_id: string;
  };
  archived: boolean;
  properties: {
    slug: {
      id: string;
      type: string;
      rich_text: {
        type: string;
        text: {
          content: string;
          link: any;
        };
        annotations: {
          bold: boolean;
          italic: boolean;
          strikethrough: boolean;
          underline: boolean;
          code: boolean;
          color: string;
        };
        plain_text: string;
        href: any;
      }[];
    };
    published: {
      id: string;
      type: string;
      checkbox: boolean;
    };
    author: {
      id: string;
      type: string;
      rich_text: {
        type: string;
        text: {
          content: string;
          link: any;
        };
        annotations: {
          bold: boolean;
          italic: boolean;
          strikethrough: boolean;
          underline: boolean;
          code: boolean;
          color: string;
        };
        plain_text: string;
        href: any;
      }[];
    };
    tags: {
      id: string;
      type: string;
      multi_select: {
        id: string;
        name: string;
        color: string;
      }[];
    };
    postedAt: {
      id: string;
      type: string;
      date: {
        start: string;
        end: any;
        time_zone: any;
      };
    };
    title: {
      id: string;
      type: string;
      title: {
        type: string;
        text: {
          content: string;
          link: any;
        };
        annotations: {
          bold: boolean;
          italic: boolean;
          strikethrough: boolean;
          underline: boolean;
          code: boolean;
          color: string;
        };
        plain_text: string;
        href: any;
      }[];
    };
  };
  url: string;
};

