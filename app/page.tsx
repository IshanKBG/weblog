import { blog } from "@/lib/blog-sdk"
import Link from "next/link"
export default async function Home() {
  const posts = await blog.getAllPosts();
  console.log(posts)
  return (
    <>
      {posts.map((post) => {
        <h1>{post.title}</h1>
      })}
    </>
  )

}
