import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  useCreateForumReplyMutation,
  useGetForumRepliesQuery,
  useGetForumThreadByIdQuery,
} from "@/features/forum/forumApi"
import { useAppSelector } from "@/hooks/redux"

export function PublicForumThreadPage() {
  const { threadId = "" } = useParams()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const [replyDraft, setReplyDraft] = useState("")
  const [replyError, setReplyError] = useState("")

  const {
    data: thread,
    isLoading: isThreadLoading,
    isError: isThreadError,
    refetch: refetchThread,
  } = useGetForumThreadByIdQuery(threadId, { skip: threadId.length === 0 })

  const {
    data: replyResult,
    isLoading: isRepliesLoading,
    isError: isRepliesError,
    refetch: refetchReplies,
  } = useGetForumRepliesQuery({ threadId, page: 1, limit: 50 }, { skip: threadId.length === 0 })

  const [createReply, { isLoading: isReplySubmitting }] = useCreateForumReplyMutation()

  const handleReplySubmit = async () => {
    const content = replyDraft.trim()
    if (!content || threadId.length === 0) {
      return
    }

    try {
      setReplyError("")
      await createReply({ threadId, content }).unwrap()
      setReplyDraft("")
      await refetchReplies()
    } catch {
      setReplyError("Unable to post reply. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-emerald-50">
      <Header />

      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-2xl border-0 bg-white p-6 shadow-md">
          <div className="mb-4">
            <Button asChild variant="outline" className="h-9 rounded-lg border-gray-200 bg-white px-3 text-gray-700 hover:bg-gray-50">
              <Link to="/forum">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Forum
              </Link>
            </Button>
          </div>

          {isThreadLoading && <p className="text-sm text-gray-600">Loading thread...</p>}

          {isThreadError && (
            <div className="text-sm text-red-700">
              Failed to load thread.
              <Button variant="link" className="h-auto p-0 pl-2 text-red-700" onClick={() => refetchThread()}>
                Retry
              </Button>
            </div>
          )}

          {!isThreadLoading && !isThreadError && thread && (
            <>
              <h1 className="text-2xl font-bold text-gray-900">{thread.title}</h1>
              <p className="mt-2 text-sm text-gray-700">{thread.content}</p>
              <p className="mt-3 text-xs text-gray-500">
                {thread.author?.name ?? "Unknown user"} • {thread.replyCount} replies • {thread.status}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(thread.tags ?? []).map((tag) => (
                  <span key={tag} className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="mt-6 border-t border-gray-100 pt-5">
            <h2 className="text-lg font-semibold text-gray-900">Replies</h2>

            <div className="mt-4 space-y-3">
              {isRepliesLoading && <p className="text-sm text-gray-600">Loading replies...</p>}

              {isRepliesError && (
                <div className="text-sm text-red-700">
                  Failed to load replies.
                  <Button variant="link" className="h-auto p-0 pl-2 text-red-700" onClick={() => refetchReplies()}>
                    Retry
                  </Button>
                </div>
              )}

              {!isRepliesLoading && !isRepliesError && (replyResult?.replies?.length ?? 0) === 0 && (
                <p className="text-sm text-gray-600">No replies yet.</p>
              )}

              {!isRepliesLoading &&
                !isRepliesError &&
                (replyResult?.replies ?? []).length > 0 && (
                  <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
                    {(replyResult?.replies ?? []).map((reply) => (
                      <article key={reply._id} className="px-4 py-3">
                        <p className="text-sm text-gray-800">{reply.content}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {reply.author?.name ?? "Unknown user"} • {new Date(reply.createdAt).toLocaleString()}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            {isAuthenticated ? (
              <div className="mt-3 space-y-3">
                <Textarea
                  rows={4}
                  value={replyDraft}
                  onChange={(event) => setReplyDraft(event.target.value)}
                  placeholder="Write your reply..."
                  className="rounded-xl"
                />
                {replyError && <p className="text-sm text-red-600">{replyError}</p>}
                <Button
                  onClick={() => void handleReplySubmit()}
                  disabled={isReplySubmitting || replyDraft.trim().length === 0}
                  className="rounded-xl bg-emerald-600 px-5 text-white hover:bg-emerald-700"
                >
                  {isReplySubmitting ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                Login to post a reply.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
