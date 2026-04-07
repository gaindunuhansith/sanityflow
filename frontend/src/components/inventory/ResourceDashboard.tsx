import { useEffect, useMemo, useState } from "react"
import { Pencil, Plus, RefreshCw, Search, SlidersHorizontal, Trash2 } from "lucide-react"
import {
  useGetResourcesQuery,
  useDeleteResourceMutation,
} from "@/features/inventory/resourceApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  selectResourceState,
  setEditingResourceId,
  setCreateResourceModalOpen,
  setResourcePage,
  setResourceSearchQuery,
  resetResourceFilters,
} from "@/features/inventory/resourceSlice"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { ResourceForm } from "@/components/inventory/ResourceForm"

const LARGE_FETCH_LIMIT = 1000

export function ResourceDashboard() {
  const dispatch = useAppDispatch()
  const { searchQuery, page, limit, isCreateModalOpen, editingResourceId } =
    useAppSelector(selectResourceState)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [stockFilter, setStockFilter] = useState<"all" | "in-stock" | "low" | "out">("all")

  const { data: response, isLoading, refetch } = useGetResourcesQuery({
    page: 1,
    limit: LARGE_FETCH_LIMIT,
  })

  const resources = response?.items ?? []

  const categories = useMemo(() => {
    return [...new Set(resources.map((resource) => resource.category).filter((category) => category.trim().length > 0))].sort((a, b) =>
      a.localeCompare(b),
    )
  }, [resources])

  const filteredResources = useMemo(() => {
    const search = searchQuery.trim().toLowerCase()

    return resources.filter((resource) => {
      if (categoryFilter !== "all" && resource.category !== categoryFilter) {
        return false
      }

      if (statusFilter === "active" && !resource.isActive) {
        return false
      }

      if (statusFilter === "inactive" && resource.isActive) {
        return false
      }

      if (stockFilter === "low" && (resource.quantity > resource.reorderLevel || resource.quantity === 0)) {
        return false
      }

      if (stockFilter === "out" && resource.quantity !== 0) {
        return false
      }

      if (stockFilter === "in-stock" && resource.quantity <= resource.reorderLevel) {
        return false
      }

      if (!search) {
        return true
      }

      return [
        resource.name,
        resource.category,
        resource.unit,
        resource.barcode ?? "",
      ].some((field) => field.toLowerCase().includes(search))
    })
  }, [resources, searchQuery, categoryFilter, statusFilter, stockFilter])

  const totalResources = filteredResources.length
  const totalPages = Math.max(1, Math.ceil(totalResources / limit))

  const paginatedResources = useMemo(() => {
    const start = (page - 1) * limit
    return filteredResources.slice(start, start + limit)
  }, [filteredResources, page, limit])

  useEffect(() => {
    if (page > totalPages) {
      dispatch(setResourcePage(totalPages))
    }
  }, [dispatch, page, totalPages])

  const [deleteResource] = useDeleteResourceMutation()

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      await deleteResource(id)
    }
  }

  const clearFilters = () => {
    dispatch(resetResourceFilters())
    setCategoryFilter("all")
    setStatusFilter("all")
    setStockFilter("all")
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-sm text-gray-500">Manage stock items, categories, quantities, and active status.</p>
        </div>
        <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white" onClick={() => void refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-4">
        <p className="text-sm text-gray-500">Total Resources</p>
        <p className="text-2xl font-semibold text-gray-900">{totalResources}</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources"
                className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
                value={searchQuery}
                onChange={(event) => dispatch(setResourceSearchQuery(event.target.value))}
              />
            </div>

            <Button variant="ghost" className="h-10 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-10 w-10 border-gray-200 bg-white"
              onClick={() => setShowAdvancedFilters((current) => !current)}
            >
              <SlidersHorizontal className="h-4 w-4 text-gray-600" />
            </Button>
            <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-4 font-medium" onClick={() => dispatch(setCreateResourceModalOpen(true))}>
              <Plus className="mr-2 h-4 w-4" />
              New Resource
            </Button>
          </div>
        </div>

        {showAdvancedFilters ? (
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 flex flex-wrap items-center gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44 h-10 rounded-xl border-gray-200 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive") }>
              <SelectTrigger className="w-40 h-10 rounded-xl border-gray-200 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={(value) => setStockFilter(value as "all" | "in-stock" | "low" | "out") }>
              <SelectTrigger className="w-40 h-10 rounded-xl border-gray-200 bg-white">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white" onClick={() => void refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        ) : null}

        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    Loading resources...
                  </TableCell>
                </TableRow>
              ) : paginatedResources.length > 0 ? (
                paginatedResources.map((resource) => (
                  <TableRow key={resource._id}>
                    <TableCell className="font-medium">{resource.name}</TableCell>
                    <TableCell>{resource.category}</TableCell>
                    <TableCell>{resource.quantity}</TableCell>
                    <TableCell>{resource.unit}</TableCell>
                    <TableCell>{resource.reorderLevel}</TableCell>
                    <TableCell>{resource.barcode || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                          resource.isActive
                            ? "bg-[#ebf8ee] text-[#4dbd74]"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {resource.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => dispatch(setEditingResourceId(resource._id))}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(resource._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    No resources found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>
            Showing {paginatedResources.length} of {totalResources} resources
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => dispatch(setResourcePage(page - 1))}>
              Previous
            </Button>
            <span>Page {page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => dispatch(setResourcePage(page + 1))}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <ResourceForm
        isOpen={isCreateModalOpen || !!editingResourceId}
        onClose={() => {
          dispatch(setCreateResourceModalOpen(false))
          dispatch(setEditingResourceId(null))
        }}
        resourceId={editingResourceId || undefined}
      />
    </div>
  )
}
