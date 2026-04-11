import { useMemo, useState } from "react"
import type { SyntheticEvent } from "react"
import { Link } from "react-router-dom"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type ForumThreadStatus,
  useCreateForumThreadMutation,
  useGetForumThreadsQuery,
} from "@/features/forum/forumApi"
import { useAppSelector } from "@/hooks/redux"

export function PublicForumPage() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"all" | ForumThreadStatus>("all")
  const [tag, setTag] = useState("all")
  const [page, setPage] = useState(1)

  const [threadTitle, setThreadTitle] = useState("")
  const [threadContent, setThreadContent] = useState("")
  const [threadTags, setThreadTags] = useState("")
  const [threadError, setThreadError] = useState("")
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false)

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      ...(status === "all" ? {} : { status }),
      ...(tag === "all" ? {} : { tag }),
      ...(search.trim().length > 0 ? { search: search.trim() } : {}),
    }),
    [page, search, status, tag],
  )

  const {
    data: threadResult,
    isLoading,
    isError,
    refetch,
  } = useGetForumThreadsQuery(params)

  const [createThread, { isLoading: isCreatingThread }] = useCreateForumThreadMutation()

  const threads = useMemo(() => threadResult?.threads ?? [], [threadResult?.threads])
  const totalPages = Math.max(1, threadResult?.totalPages ?? 1)
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const thread of threads) {
      for (const threadTag of thread.tags ?? []) {
        tagSet.add(threadTag)
      }
    }

    return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
  }, [threads])

  const handleCreateThread = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = threadTitle.trim()
    const content = threadContent.trim()

    if (!title || !content) {
      setThreadError("Title and content are required.")
      return
    }

    const tags = threadTags
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)

    try {
      setThreadError("")
      await createThread({
        title,
        content,
        tags,
        status: "Open",
      }).unwrap()
      setThreadTitle("")
      setThreadContent("")
      setThreadTags("")
      setIsCreateThreadModalOpen(false)
      await refetch()
    } catch {
      setThreadError("Unable to create thread. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-emerald-50">
      <Header />

      <section className="relative overflow-hidden bg-white py-20">
        <div className="absolute inset-0 bg-linear-to-r from-emerald-600/5 to-emerald-800/5"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">Community Forum</h1>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-4 rounded-2xl border-0 bg-white p-6 shadow-md">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="w-full md:w-96">
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search threads"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="flex w-full items-center justify-center gap-2 md:w-auto">
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value as "all" | ForumThreadStatus)
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-11 w-35 rounded-xl bg-white">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={tag}
                onValueChange={(value) => {
                  setTag(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-11 w-35 rounded-xl bg-white">
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tags</SelectItem>
                  {allTags.map((forumTag) => (
                    <SelectItem key={forumTag} value={forumTag}>
                      {forumTag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="h-11 rounded-xl bg-emerald-600 px-5 text-white hover:bg-emerald-700"
              onClick={() => {
                setThreadError("")
                setIsCreateThreadModalOpen(true)
              }}
            >
              Post New Thread
            </Button>
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-3">
          {isLoading && (
            <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-600">
              Loading forum threads...
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              Failed to load threads.
              <Button variant="link" className="h-auto p-0 pl-2 text-red-700" onClick={() => { refetch() }}>
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !isError && threads.length === 0 && (
            <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-600">
              No threads found.
            </div>
          )}

          {!isLoading && !isError && threads.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              {threads.map((thread) => (
                <article key={thread._id} className="border-b border-gray-100 p-5 last:border-b-0">
                  <Link className="block" to={`/forum/${thread._id}`}>
                    <h2 className="text-lg font-semibold text-gray-900">{thread.title}</h2>
                    <p className="mt-1 text-sm text-gray-700">{thread.content}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      {thread.author?.name ?? "Unknown user"} • {thread.replyCount} replies • {thread.status}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(thread.tags ?? []).map((threadTag) => (
                        <span key={threadTag} className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                          {threadTag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" className="rounded-lg" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
              Previous
            </Button>
            <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
            <Button variant="outline" size="sm" className="rounded-lg" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>
              Next
            </Button>
          </div>
          </div>
        </section>

      </main>

      <Dialog open={isCreateThreadModalOpen} onOpenChange={setIsCreateThreadModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Start A New Thread</DialogTitle>
          </DialogHeader>

          {isAuthenticated ? (
            <form className="space-y-3" onSubmit={(event) => void handleCreateThread(event)}>
              <Input
                value={threadTitle}
                onChange={(event) => setThreadTitle(event.target.value)}
                placeholder="Thread title"
                className="h-11 rounded-xl"
              />
              <Textarea
                rows={5}
                value={threadContent}
                onChange={(event) => setThreadContent(event.target.value)}
                placeholder="What do you want to discuss?"
                className="rounded-xl"
              />
              <Input
                value={threadTags}
                onChange={(event) => setThreadTags(event.target.value)}
                placeholder="Tags (comma-separated)"
                className="h-11 rounded-xl"
              />

              {threadError && <p className="text-sm text-red-600">{threadError}</p>}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateThreadModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingThread} className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                  {isCreatingThread ? "Posting..." : "Post Thread"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <p className="text-sm text-gray-600">
              <Link to="/login" className="text-emerald-700 underline">
                Login
              </Link>{" "}
              to create a new forum thread.
            </p>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
