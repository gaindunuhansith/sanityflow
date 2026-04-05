import { useMemo } from "react"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { useGetBlogsQuery, useDeleteBlogMutation } from "@/features/blog/blogApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import {
  selectBlogState,
  setBlogSearchQuery,
  setCreateBlogModalOpen,
  setEditingBlogPostId,
} from "@/features/blog/blogSlice"

export function BlogDashboard() {
  const dispatch = useAppDispatch()
  const { searchQuery, statusFilter, page, limit } = useAppSelector(selectBlogState)

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(searchQuery.trim().length > 0 ? { search: searchQuery.trim() } : {}),
    }),
    [limit, page, searchQuery, statusFilter],
  )

  const { data: response, isLoading } = useGetBlogsQuery(queryParams)
  const blogs = response?.posts || []

  const [deleteBlog] = useDeleteBlogMutation()

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await deleteBlog(id)
    }
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
    </div>
  )
}