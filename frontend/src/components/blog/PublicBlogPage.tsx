import { Link } from "react-router-dom"
import { useMemo, useState } from "react"
import { Sparkles } from "lucide-react"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useGetBlogsQuery } from "@/features/blog/blogApi"

export function PublicBlogPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      status: "Published" as const,
      ...(search.trim().length > 0 ? { search: search.trim() } : {}),
    }),
    [page, search],
  )

  const { data, isLoading, isError, refetch } = useGetBlogsQuery(params)

  const posts = data?.posts ?? []
  const totalPages = Math.max(1, data?.totalPages ?? 1)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-emerald-50">
      <Header />

      <section className="relative overflow-hidden bg-white py-20">
        <div className="absolute inset-0 bg-linear-to-r from-emerald-600/5 to-emerald-800/5"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">Blog</h1>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[680px] px-4 py-12 sm:px-6">
        <div className="mb-10 flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-[17px] font-medium text-gray-900">Latest</h2>
          <div className="w-64">
             <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search stories"
                className="h-9 rounded-full bg-gray-50 border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-emerald-500"
              />
          </div>
        </div>

        <section className="flex flex-col">
          {isLoading && <p className="text-sm text-gray-600 py-4">Loading original stories...</p>}

          {isError && (
            <p className="text-sm text-red-700 py-4">
              Failed to load stories.
              <Button variant="link" className="h-auto p-0 pl-2 text-red-700" onClick={() => refetch()}>
                Retry
              </Button>
            </p>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <p className="text-sm text-gray-600 py-4">No stories found.</p>
          )}

          {!isLoading &&
            !isError &&
            posts.map((post) => {
              const readTime = Math.max(1, Math.ceil((post.content?.length || 0) / 1000))
              const defaultImage = "https://images.unsplash.com/photo-1542435503-956c224213d2?q=80&w=2670&auto=format&fit=crop"

              return (
                <article key={post._id} className="py-8 border-b border-gray-100 last:border-0 last:pb-0">
                  <Link to={`/blog/${post._id}`} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-[22px] font-bold text-gray-900 leading-tight tracking-tight group-hover:text-gray-700 mb-3">
                        {post.title}
                      </h2>
                      <div className="mb-4 pr-4">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 mb-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>AI Overview</span>
                        </div>
                        <p className="text-[15px] leading-[22px] text-gray-600 line-clamp-2">
                          {post.summary || post.content.slice(0, 180).replace(/<[^>]*>?/gm, "").trim()}
                        </p>
                      </div>
                      <div className="flex items-center text-[13px] text-gray-500 space-x-1.5">
                        <span>
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span>·</span>
                        <span>{readTime} min read</span>
                        {post.tags?.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                              {post.tags[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 w-full sm:w-[160px] h-[160px] sm:h-[105px] overflow-hidden rounded">
                      <img 
                        src={post.coverImage || defaultImage} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-50 border border-gray-100"
                      />
                    </div>
                  </Link>
                </article>
              )
            })}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-12">
              <Button variant="outline" size="sm" className="rounded-full" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="rounded-full" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>
                Next
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
