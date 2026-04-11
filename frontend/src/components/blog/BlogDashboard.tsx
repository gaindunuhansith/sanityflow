import { useMemo, useState } from "react"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"

import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  type BlogPostStatus,
} from "@/features/blog/blogApi"
import {
  selectBlogState,
  setBlogLimit,
  setBlogPage,
  setBlogSearchQuery,
  setBlogStatusFilter,
  setCreateBlogModalOpen,
  setEditingBlogPostId,
} from "@/features/blog/blogSlice"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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

export function BlogDashboard() {
  const dispatch = useAppDispatch()
  const { searchQuery, statusFilter, page, limit, isCreateModalOpen, editingPostId } = useAppSelector(selectBlogState)

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(statusFilter === "all" ? {} : { status: statusFilter }),
      ...(searchQuery.trim().length > 0 ? { search: searchQuery.trim() } : {}),
    }),
    [limit, page, searchQuery, statusFilter],
  )

  const { data: response, isLoading, refetch } = useGetBlogsQuery(queryParams)
  const blogs = useMemo(() => response?.posts ?? [], [response])
  const totalPages = Math.max(1, response?.totalPages ?? 1)

  const [deleteBlog] = useDeleteBlogMutation()
  const [createBlog] = useCreateBlogMutation()
  const [updateBlog] = useUpdateBlogMutation()

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    tags: "",
    status: "Draft" as BlogPostStatus,
  })

  const handleDelete = async (id: string) => {
    if (!globalThis.confirm("Are you sure you want to delete this blog post?")) {
      return
    }

    try {
      await deleteBlog(id).unwrap()
      await refetch()
    } catch (error) {
      console.error("Failed to delete blog post", error)
    }
  }

  const handleSave = async () => {
    const payload = {
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      status: formData.status,
    }

    try {
      if (editingPostId) {
        await updateBlog({ id: editingPostId, data: payload }).unwrap()
      } else {
        await createBlog(payload).unwrap()
      }
      handleCloseModal()
      await refetch()
    } catch (error) {
      console.error("Failed to save blog post:", error)
    }
  }

  const handleCloseModal = () => {
    dispatch(setCreateBlogModalOpen(false))
    dispatch(setEditingBlogPostId(null))
  }

  const handleOpenCreate = () => {
    setFormData({
      title: "",
      summary: "",
      content: "",
      tags: "",
      status: "Draft",
    })
    dispatch(setEditingBlogPostId(null))
    dispatch(setCreateBlogModalOpen(true))
  }

  const handleOpenEdit = (postId: string) => {
    const blogToEdit = blogs.find((blog) => blog._id === postId)

    if (!blogToEdit) {
      return
    }

    setFormData({
      title: blogToEdit.title,
      summary: blogToEdit.summary || "",
      content: blogToEdit.content,
      tags: blogToEdit.tags.join(", "),
      status: blogToEdit.status,
    })
    dispatch(setEditingBlogPostId(postId))
    dispatch(setCreateBlogModalOpen(false))
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Blog Management</h1>
        <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-4 font-medium" onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Blog Post
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-70">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search posts"
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
              value={searchQuery}
              onChange={(event) => dispatch(setBlogSearchQuery(event.target.value))}
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => dispatch(setBlogStatusFilter(value as "all" | BlogPostStatus))}>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="rounded-md border">
          <div className="flex flex-col">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog._id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50">
                  <div>
                    <h3 className="font-semibold">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground">{blog.summary}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${blog.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {blog.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenEdit(blog._id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => void handleDelete(blog._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">No blog posts found.</div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <span className="text-sm text-gray-500">Rows</span>
        <Select value={String(limit)} onValueChange={(value) => dispatch(setBlogLimit(Number(value)))}>
          <SelectTrigger className="h-9 w-23 rounded-lg border-gray-200 bg-white">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => dispatch(setBlogPage(page - 1))}>
          Previous
        </Button>
        <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => dispatch(setBlogPage(page + 1))}>
          Next
        </Button>
      </div>

      <Dialog open={isCreateModalOpen || !!editingPostId} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-156.25">
          <DialogHeader>
            <DialogTitle>{editingPostId ? "Edit Blog Post" : "Add Blog Post"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog post title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Enter brief summary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
              <Textarea
                id="content"
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter blog post content..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. water, health, update"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as BlogPostStatus })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={() => void handleSave()} disabled={!formData.title.trim() || !formData.content.trim()}>
              {editingPostId ? "Save Changes" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
