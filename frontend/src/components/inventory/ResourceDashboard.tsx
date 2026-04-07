import { useMemo, useState, useEffect } from "react"
import { Search, Plus, Pencil, Trash2, Barcode } from "lucide-react"
import {
  useGetResourcesQuery,
  useDeleteResourceMutation,
  useGetResourceByBarcodeQuery,
  type Resource,
} from "@/features/inventory/resourceApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import {
  selectResourceState,
  setResourceSearchQuery,
  setCreateResourceModalOpen,
  setEditingResourceId,
  setBarcodeInput,
  setSelectedBarcodeResource,
  clearBarcodeInput,
} from "@/features/inventory/resourceSlice"
import { ResourceForm } from "@/components/inventory/ResourceForm"

export function ResourceDashboard() {
  const dispatch = useAppDispatch()
  const { searchQuery, page, limit, isCreateModalOpen, editingResourceId, barcodeInput } =
    useAppSelector(selectResourceState)
  const [showBarcodeModal, setShowBarcodeModal] = useState(false)
  const [debouncedBarcode, setDebouncedBarcode] = useState("")

  // Debounce barcode input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (barcodeInput.trim()) {
        setDebouncedBarcode(barcodeInput.trim())
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [barcodeInput])

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(searchQuery.trim().length > 0 ? { search: searchQuery.trim() } : {}),
    }),
    [limit, page, searchQuery],
  )

  const { data: response, isLoading } = useGetResourcesQuery(queryParams)
  const { data: barcodeResource } = useGetResourceByBarcodeQuery(debouncedBarcode, {
    skip: !debouncedBarcode,
  })
  const resources = response?.items || []

  const [deleteResource] = useDeleteResourceMutation()

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      await deleteResource(id)
    }
  }

  const handleBarcodeFound = (resource: Resource) => {
    dispatch(setSelectedBarcodeResource(resource._id))
    setShowBarcodeModal(false)
    dispatch(clearBarcodeInput())
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Resources Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBarcodeModal(true)}>
            <Barcode className="mr-2 h-4 w-4" /> Scan Barcode
          </Button>
          <Button onClick={() => dispatch(setCreateResourceModalOpen(true))}>
            <Plus className="mr-2 h-4 w-4" /> Add Resource
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => dispatch(setResourceSearchQuery(e.target.value))}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading resources...</div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
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
              {resources.length > 0 ? (
                resources.map((resource) => (
                  <TableRow key={resource._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{resource.name}</TableCell>
                    <TableCell>{resource.category}</TableCell>
                    <TableCell>{resource.quantity}</TableCell>
                    <TableCell>{resource.unit}</TableCell>
                    <TableCell>{resource.reorderLevel}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {resource.barcode ? (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono">
                          {resource.barcode}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          resource.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
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
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No resources found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Barcode Modal */}
      <Dialog open={showBarcodeModal} onOpenChange={setShowBarcodeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Resource Barcode</DialogTitle>
            <DialogDescription>Enter or scan a barcode to find and auto-fill resource details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Scan barcode here..."
              value={barcodeInput}
              onChange={(e) => dispatch(setBarcodeInput(e.target.value))}
              autoFocus
            />
            {barcodeResource && (
              <div className="space-y-3 p-3 bg-green-50 rounded-md border border-green-200">
                <p className="font-semibold text-green-900">Barcode Found!</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{barcodeResource.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="font-medium">{barcodeResource.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <p className="font-medium">{barcodeResource.quantity}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Unit:</span>
                    <p className="font-medium">{barcodeResource.unit}</p>
                  </div>
                </div>
                <Button onClick={() => handleBarcodeFound(barcodeResource)} className="w-full">
                  Use This Resource
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
