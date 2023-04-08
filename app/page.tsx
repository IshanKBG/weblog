import { blog } from "@/lib/blog-sdk"
import Link from "next/link"
export default async function Home() {
  const posts = await blog.getAllPosts();
  console.log(posts)
  return (
    <>
      {posts.map((post, index) => (
        <section key={index}>
          <div>
            <h2>
              <Link href={post.slug}>
                {post.title}
              </Link>
            </h2>
          </div>
          <p>{post.postedAt.toString()}</p>
          <p>{post.desc}</p>
        </section>
      ))}
    </>

  )

}
