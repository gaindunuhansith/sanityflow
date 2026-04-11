import { Link, useParams } from "react-router-dom"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { useGetBlogByIdQuery } from "@/features/blog/blogApi"

export function PublicBlogPostPage() {
  const { id = "" } = useParams()

  const { data: post, isLoading, isError, refetch } = useGetBlogByIdQuery(id, {
    skip: id.length === 0,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <Header />

      <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-2xl bg-white p-5 shadow-md">
          <Button asChild variant="outline" className="rounded-lg">
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-md">
          {isLoading && <p className="text-sm text-gray-600">Loading post...</p>}

          {isError && (
            <p className="text-sm text-red-700">
              Failed to load post.
              <Button variant="link" className="h-auto p-0 pl-2 text-red-700" onClick={() => refetch()}>
                Retry
              </Button>
            </p>
          )}

          {!isLoading && !isError && post && (
            <article>
              <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
              <p className="mt-2 text-sm text-gray-500">
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {(post.tags ?? []).map((tag) => (
                  <span key={tag} className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                    {tag}
                  </span>
                ))}
              </div>

              {post.summary && <p className="mt-4 text-base text-gray-700">{post.summary}</p>}

              <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-800">{post.content}</div>
            </article>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
