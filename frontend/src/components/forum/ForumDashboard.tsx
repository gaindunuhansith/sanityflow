import React, { useMemo, useState } from "react"
import { Search, ChevronDown, SlidersHorizontal, Calendar, Download, ChevronRight, Pencil, Trash2, ChevronsUpDown, MessageSquareReply, Plus } from "lucide-react"
import {
  selectForumState,
  clearReplyDraft,
  setCreateThreadModalOpen,
  setEditingThreadId,
  setPeriodFilter,
  setSearchQuery,
  setStatusFilter,
  setTagFilter,
  toggleExpandThread,
  updateReplyDraft,
} from "@/features/forum/forumSlice"
import {
  type ForumThread,
  useCreateForumReplyMutation,
  useCreateForumThreadMutation,
  useDeleteForumThreadMutation,
  useGetForumRepliesQuery,
  useGetForumThreadsQuery,
  useUpdateForumThreadMutation,
  type ForumThreadStatus,
} from "@/features/forum/forumApi"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

const getApiErrorMessage = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return "Request failed. Please try again."
  }

  const maybeError = error as { data?: unknown }
  const data = maybeError.data

  if (data && typeof data === "object") {
    const maybeMessage = data as { message?: unknown; error?: unknown }
    if (typeof maybeMessage.message === "string" && maybeMessage.message.trim().length > 0) {
      return maybeMessage.message
    }

    if (typeof maybeMessage.error === "string" && maybeMessage.error.trim().length > 0) {
      return maybeMessage.error
    }
  }

  return "Request failed. Please try again."
}

export function ForumDashboard() {
  const dispatch = useAppDispatch()
  const {
    expandedThreadIds,
    searchQuery,
    tagFilter,
    statusFilter,
    periodFilter,
    replyDraftByThreadId,
    isCreateThreadModalOpen,
    editingThreadId,
  } = useAppSelector(selectForumState)
  const [createReply, { isLoading: isReplySubmitting }] = useCreateForumReplyMutation()
  const [createThread, { isLoading: isCreatingThread }] = useCreateForumThreadMutation()
  const [updateThread, { isLoading: isUpdatingThread }] = useUpdateForumThreadMutation()
  const [deleteThread] = useDeleteForumThreadMutation()

  const [threadForm, setThreadForm] = useState({
    title: "",
    content: "",
    tags: "",
    status: "Open" as ForumThreadStatus,
  })
  const [threadFormError, setThreadFormError] = useState("")

  const threadQueryParams = useMemo(() => {
    const hasSearch = searchQuery.trim().length > 0
    const hasTag = tagFilter === "all"
    const hasStatus = statusFilter === "all"

    return {
      page: 1,
      limit: 10,
      ...(hasSearch ? { search: searchQuery.trim() } : {}),
      ...(hasTag ? {} : { tag: tagFilter }),
      ...(hasStatus ? {} : { status: statusFilter }),
    }
  }, [searchQuery, statusFilter, tagFilter])

  const {
    data: threadResult,
    isLoading: isThreadsLoading,
    isFetching: isThreadsFetching,
    isError: isThreadsError,
    refetch: refetchThreads,
  } = useGetForumThreadsQuery(threadQueryParams)

  const threads = useMemo(() => threadResult?.threads ?? [], [threadResult?.threads])
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const thread of threads) {
      for (const tag of thread.tags ?? []) {
        tagSet.add(tag)
      }
    }

    return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
  }, [threads])

  const toggleExpand = (id: string) => {
    dispatch(toggleExpandThread(id))
  }

  const closeThreadModal = () => {
    dispatch(setCreateThreadModalOpen(false))
    dispatch(setEditingThreadId(null))
    setThreadFormError("")
  }

  const openCreateThread = () => {
    setThreadForm({
      title: "",
      content: "",
      tags: "",
      status: "Open",
    })
    setThreadFormError("")
    dispatch(setEditingThreadId(null))
    dispatch(setCreateThreadModalOpen(true))
  }

  const openEditThread = (threadId: string) => {
    const targetThread = threads.find((thread) => thread._id === threadId)
    if (!targetThread) {
      return
    }

    setThreadForm({
      title: targetThread.title,
      content: targetThread.content,
      tags: targetThread.tags.join(", "),
      status: targetThread.status,
    })
    dispatch(setEditingThreadId(threadId))
    dispatch(setCreateThreadModalOpen(false))
    setThreadFormError("")
  }

  const saveThread = async () => {
    const title = threadForm.title.trim()
    const content = threadForm.content.trim()
    const tags = threadForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (!title || !content) {
      setThreadFormError("Title and content are required.")
      return
    }

    setThreadFormError("")

    try {
      if (editingThreadId) {
        await updateThread({
          id: editingThreadId,
          data: {
            title,
            content,
            tags,
            status: threadForm.status,
          },
        }).unwrap()
      } else {
        await createThread({
          title,
          content,
          tags,
          status: threadForm.status,
        }).unwrap()
      }

      closeThreadModal()
      await refetchThreads()
    } catch (error) {
      setThreadFormError(getApiErrorMessage(error))
    }
  }

  const handleDeleteThread = async (threadId: string) => {
    if (!confirm("Are you sure you want to delete this thread?")) {
      return
    }

    try {
      await deleteThread(threadId).unwrap()
      await refetchThreads()
    } catch (error) {
      console.error("Unable to delete thread", error)
    }
  }

  const submitReply = async (threadId: string) => {
    const content = replyDraftByThreadId[threadId]?.trim()
    if (!content) {
      return
    }

    try {
      await createReply({ threadId, content }).unwrap()
      dispatch(clearReplyDraft({ threadId }))
    } catch {
      // Backend validation/auth errors are surfaced in network tooling for now.
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Recent Threads</h1>
          <Button
            className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-4 font-medium"
            onClick={openCreateThread}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Thread
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Select value={periodFilter} onValueChange={(value) => dispatch(setPeriodFilter(value as "this-month" | "last-month" | "this-year"))}>
            <SelectTrigger className="w-32.5 rounded-xl h-10 border-gray-200 bg-white">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-gray-200 bg-white">
            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-70">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search thread"
              value={searchQuery}
              onChange={(event) => dispatch(setSearchQuery(event.target.value))}
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => dispatch(setStatusFilter(value as "all" | "Open" | "Closed"))}>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tagFilter} onValueChange={(value) => dispatch(setTagFilter(value))}>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white text-gray-700 font-medium">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            1-30 September 2028
            <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
          </Button>
          <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-5 font-medium">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table className="w-full text-left">
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="text-gray-500 font-semibold text-xs w-[45%] py-4 pl-4">Thread</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-32 py-4">Author</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs text-center w-20 py-4">Replies</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-28 py-4">
                <div className="flex items-center justify-between">
                  Status
                  <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />
                </div>
              </TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs text-right pr-6 w-24 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isThreadsLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-gray-500">
                  Loading forum threads...
                </TableCell>
              </TableRow>
            )}

            {!isThreadsLoading && isThreadsError && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-red-500">
                  Unable to load forum threads.
                  <Button variant="link" className="ml-1 h-auto p-0 text-red-500" onClick={() => refetchThreads()}>
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            )}

            {!isThreadsLoading && !isThreadsError && threads.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-gray-500">
                  No threads found.
                </TableCell>
              </TableRow>
            )}

            {threads.map((thread) => {
              const isExpanded = expandedThreadIds.includes(thread._id);
              const primaryTag = thread.tags?.[0] ?? "discussion"

              return (
                <React.Fragment key={thread._id}>
                  <TableRow 
                    className={`group transition-colors border-b ${
                      isExpanded 
                        ? "bg-emerald-50/40 hover:bg-emerald-50/60 border-emerald-100" 
                        : "hover:bg-gray-50/50 border-gray-50"
                    }`}
                  >
                    <TableCell className="pl-4 py-4">
                      <button 
                        onClick={() => toggleExpand(thread._id)} 
                        className="flex items-center gap-3 text-left w-full focus:outline-none group"
                      >
                        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-90 text-emerald-600" : "text-gray-400 group-hover:text-emerald-600"
                        }`} />
                        
                        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] uppercase tracking-wide text-emerald-700">
                          {primaryTag}
                        </div>

                        <div className="flex flex-col max-w-50 sm:max-w-62.5 md:max-w-[320px]">
                          <span className={`font-semibold text-[13px] truncate pr-4 ${isExpanded ? "text-emerald-900" : "text-gray-900"}`}>
                            {thread.title}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-0.5 truncate pr-4">
                            <span className="capitalize text-gray-700 mr-1">{primaryTag}</span> • {thread.content}
                          </span>
                        </div>
                      </button>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 py-4">
                       {thread.author?.name}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <span className={thread.replyCount > 0 ? "text-emerald-700 font-semibold" : "text-gray-500 font-medium"}>
                        {thread.replyCount}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      {thread.status === "Closed" ? (
                        <span className="inline-flex items-center justify-center px-3 tracking-wide py-1 rounded-md text-[11px] font-semibold bg-[#ebf8ee] text-[#4dbd74] whitespace-nowrap">
                          Closed
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-3 tracking-wide py-1 rounded-md text-[11px] font-semibold bg-red-50 text-red-500 whitespace-nowrap">
                          Open
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                          onClick={() => openEditThread(thread._id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteThread(thread._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Replies Section */}
                  {isExpanded && (
                    <TableRow className="bg-emerald-50/5 border-b border-gray-100 hover:bg-emerald-50/5">
                      <TableCell colSpan={5} className="p-0">
                        <ThreadRepliesPanel
                          thread={thread}
                          draftValue={replyDraftByThreadId[thread._id] ?? ""}
                          isSubmittingReply={isReplySubmitting}
                          onDraftChange={(value) =>
                            dispatch(updateReplyDraft({ threadId: thread._id, value }))
                          }
                          onSubmit={() => submitReply(thread._id)}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}

            {isThreadsFetching && !isThreadsLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-3 text-center text-xs text-gray-500">
                  Refreshing...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateThreadModalOpen || Boolean(editingThreadId)} onOpenChange={closeThreadModal}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingThreadId ? "Edit Thread" : "Create Thread"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="thread-title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="thread-title"
                value={threadForm.title}
                onChange={(event) => setThreadForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Enter thread title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="thread-content">Content <span className="text-red-500">*</span></Label>
              <Textarea
                id="thread-content"
                rows={6}
                value={threadForm.content}
                onChange={(event) => setThreadForm((prev) => ({ ...prev, content: event.target.value }))}
                placeholder="Write thread content"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="thread-tags">Tags (comma-separated)</Label>
                <Input
                  id="thread-tags"
                  value={threadForm.tags}
                  onChange={(event) => setThreadForm((prev) => ({ ...prev, tags: event.target.value }))}
                  placeholder="e.g. alerts, training"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="thread-status">Status</Label>
                <Select
                  value={threadForm.status}
                  onValueChange={(value) => setThreadForm((prev) => ({ ...prev, status: value as ForumThreadStatus }))}
                >
                  <SelectTrigger id="thread-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {threadFormError ? (
              <p className="text-sm text-red-500">{threadFormError}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeThreadModal}>Cancel</Button>
            <Button
              onClick={() => void saveThread()}
              disabled={!threadForm.title.trim() || !threadForm.content.trim() || isCreatingThread || isUpdatingThread}
            >
              {editingThreadId ? "Save Changes" : "Create Thread"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ThreadRepliesPanelProps {
  readonly thread: ForumThread
  readonly draftValue: string
  readonly isSubmittingReply: boolean
  readonly onDraftChange: (value: string) => void
  readonly onSubmit: () => void
}

function ThreadRepliesPanel({
  thread,
  draftValue,
  isSubmittingReply,
  onDraftChange,
  onSubmit,
}: ThreadRepliesPanelProps) {
  const {
    data: repliesResult,
    isLoading,
    isError,
  } = useGetForumRepliesQuery({ threadId: thread._id, page: 1, limit: 20 })

  const replies = repliesResult?.replies ?? []

  return (
    <div className="bg-emerald-50/20 border-t border-emerald-100/50">
      <div className="px-10 py-6">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquareReply className="h-4 w-4 text-emerald-700" />
          <h3 className="text-sm font-semibold text-gray-900">
            Thread Replies ({thread.replyCount})
          </h3>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500">
            Loading replies...
          </div>
        )}

        {!isLoading && isError && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-500">
            Unable to load replies for this thread.
          </div>
        )}

        {!isLoading && !isError && replies.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-100 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">No replies yet for this thread.</p>
          </div>
        )}

        {!isLoading && !isError && replies.length > 0 && (
          <div className="space-y-4">
            {replies.map((reply) => {
              const date = new Date(reply.createdAt)
              const formattedDate = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
              const formattedTime = date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })

              return (
                <div
                  key={reply._id}
                  className="relative ml-2 rounded-xl border border-gray-100 border-l-[3px] border-l-emerald-600 bg-white p-4 pl-4 shadow-sm before:absolute before:-left-4 before:top-6 before:h-px before:w-4 before:bg-gray-200"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {reply.author?.name ?? "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formattedDate} at {formattedTime}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {reply.content}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-4 ml-2 flex gap-3">
          <Input
            placeholder="Type your reply..."
            value={draftValue}
            onChange={(event) => onDraftChange(event.target.value)}
            className="border-gray-200 bg-white focus-visible:ring-emerald-500"
          />
          <Button
            className="shrink-0 bg-[#0F392B] text-white hover:bg-[#0F392B]/90"
            disabled={!draftValue.trim() || isSubmittingReply}
            onClick={onSubmit}
          >
            {isSubmittingReply ? "Sending..." : "Reply"}
          </Button>
        </div>
      </div>
    </div>
  )
}
