import { useMemo, useState, useEffect } from "react"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { 
  useGetBlogsQuery, 
  useDeleteBlogMutation,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  type BlogPostStatus
} from "@/features/blog/blogApi"
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
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import {
  selectBlogState,
  setBlogSearchQuery,
  setCreateBlogModalOpen,
  setEditingBlogPostId,
} from "@/features/blog/blogSlice"

export function BlogDashboard() {
  const dispatch = useAppDispatch()
  const { searchQuery, statusFilter, page, limit, isCreateModalOpen, editingPostId } = useAppSelector(selectBlogState)

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(searchQuery.trim().length > 0 ? { search: searchQuery.trim() } : {}),
    }),
    [limit, page, searchQuery, statusFilter],
  )

  const { data: response, isLoading, refetch } = useGetBlogsQuery(queryParams)
  const blogs = useMemo(() => response?.posts || [], [response])

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

  // Set form data when modal opens
  useEffect(() => {
    if (editingPostId) {
      const blogToEdit = blogs.find(b => b._id === editingPostId)
      if (blogToEdit) {
        setFormData({
          title: blogToEdit.title,
          summary: blogToEdit.summary || "",
          content: blogToEdit.content,
          tags: blogToEdit.tags.join(", "),
          status: blogToEdit.status,
        })
      }
    } else if (isCreateModalOpen) {
      setFormData({
        title: "",
        summary: "",
        content: "",
        tags: "",
        status: "Draft",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPostId, isCreateModalOpen])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlog(id).unwrap()
        refetch()
      } catch (error) {
        console.error("Failed to delete blog post", error)
      }
    }
  }

  const handleSave = async () => {
    const payload = {
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      status: formData.status,
    }

    try {
      if (editingPostId) {
        await updateBlog({ id: editingPostId, data: payload }).unwrap()
      } else {
        await createBlog(payload).unwrap()
      }
      handleCloseModal()
      refetch()
    } catch (error) {
      console.error("Failed to save blog post:", error)
    }
  }

  const handleCloseModal = () => {
    dispatch(setCreateBlogModalOpen(false))
    dispatch(setEditingBlogPostId(null))
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
        <Button onClick={() => dispatch(setCreateBlogModalOpen(true))}>
          <Plus className="mr-2 h-4 w-4" /> Add Blog Post
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => dispatch(setBlogSearchQuery(e.target.value))}
          />
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
                      <span className={`px-2 py-0.5 text-xs rounded-full ${blog.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {blog.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => dispatch(setEditingBlogPostId(blog._id))}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(blog._id)}>
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

      {/* Edit / Create Dialog */}
      <Dialog open={isCreateModalOpen || !!editingPostId} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[625px]">
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
            <Button onClick={handleSave} disabled={!formData.title.trim() || !formData.content.trim()}>
              {editingPostId ? "Save Changes" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}