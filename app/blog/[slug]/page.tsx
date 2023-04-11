import { blog } from "@/services/blog"
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default async function Post({
  params,
}: {
  params: { slug: string };
}) {
  const post = await blog.getPost(params.slug);
  console.log(post)
  return <ReactMarkdown>{post.markdown}</ReactMarkdown>;
}

