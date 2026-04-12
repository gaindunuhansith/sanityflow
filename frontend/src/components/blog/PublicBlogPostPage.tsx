import { Link, useParams } from "react-router-dom"
import { Sparkles } from "lucide-react"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { useGetBlogAiSummaryQuery, useGetBlogByIdQuery } from "@/features/blog/blogApi"

export function PublicBlogPostPage() {
  const { id = "" } = useParams()

  const { data: post, isLoading, isError, refetch } = useGetBlogByIdQuery(id, {
    skip: id.length === 0,
  })
  const { data: aiSummaryResult, isLoading: isLoadingAiSummary } = useGetBlogAiSummaryQuery(post?._id ?? "", {
    skip: !post?._id,
  })

  const readTime = Math.max(1, Math.ceil((post?.content?.length || 0) / 1000))
  const defaultImage = "https://images.unsplash.com/photo-1542435503-956c224213d2?q=80&w=2670&auto=format&fit=crop"

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="mx-auto w-full max-w-170 px-4 py-12 sm:px-6">
        <div className="mb-8">
          <Button asChild variant="link" className="h-auto p-0 text-emerald-700 hover:text-emerald-800 font-medium">
            <Link to="/blog">← Back to Blog</Link>
          </Button>
        </div>

        <section className="flex flex-col">
          {isLoading && <p className="text-sm text-gray-600 py-4">Loading original story...</p>}

          {isError && (
            <div className="py-4">
              <p className="text-sm text-red-700 mb-2">Failed to load story.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !isError && post && (
            <article>
              <h1 className="text-[42px] leading-[1.1] font-bold text-gray-900 tracking-tight sm:text-[46px] mb-6">
                {post.title}
              </h1>
              
              <div className="mb-8">
                <div className="flex items-center space-x-1.5 text-[15px] font-semibold text-emerald-700 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Overview</span>
                </div>
                <h2 className="text-[20px] leading-7 text-gray-600 sm:text-[22px]">
                  {isLoadingAiSummary
                    ? "Generating AI overview..."
                    : aiSummaryResult?.summary || post.summary || post.content.slice(0, 200).replaceAll(/<[^>]*>?/g, "").trim() + "..."}
                </h2>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-4 py-2 text-[14px] text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center text-[13px] text-gray-500 mb-10">
                <span>{readTime} min read</span>
                <span className="mx-1.5">·</span>
                <span>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="mb-12 w-full bg-gray-50 aspect-video rounded-sm overflow-hidden">
                <img 
                  src={post.coverImage || defaultImage} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-serif prose-headings:font-sans prose-p:text-[20px] prose-p:leading-[32px]">
                {post.content.split('\n\n').map((paragraph) => (
                  <p key={`${paragraph.slice(0, 48)}-${paragraph.length}`} className="mb-8">{paragraph}</p>
                ))}
              </div>

            </article>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
