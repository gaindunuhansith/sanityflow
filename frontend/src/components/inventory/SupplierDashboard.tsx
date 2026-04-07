import { useMemo } from "react"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import {
  useGetSuppliersQuery,
  useDeleteSupplierMutation,
} from "@/features/inventory/supplierApi"
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
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import {
  selectSupplierState,
  setSupplierSearchQuery,
  setCreateSupplierModalOpen,
  setEditingSuppllierId,
} from "@/features/inventory/supplierSlice"
import { SupplierForm } from "@/components/inventory/SupplierForm"

export function SupplierDashboard() {
  const dispatch = useAppDispatch()
  const { searchQuery, page, limit, isCreateModalOpen, editingSuppllierId } =
    useAppSelector(selectSupplierState)

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(searchQuery.trim().length > 0 ? { search: searchQuery.trim() } : {}),
    }),
    [limit, page, searchQuery],
  )

  const { data: response, isLoading } = useGetSuppliersQuery(queryParams)
  const suppliers = response?.items || []

  const [deleteSupplier] = useDeleteSupplierMutation()

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      await deleteSupplier(id)
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Management</h1>
        <Button onClick={() => dispatch(setCreateSupplierModalOpen(true))}>
          <Plus className="mr-2 h-4 w-4" /> Add Supplier
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => dispatch(setSupplierSearchQuery(e.target.value))}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading suppliers...</div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <TableRow key={supplier._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {supplier.contact?.email || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {supplier.contact?.phone || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {supplier.contact?.address || "-"}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{supplier.reliabilityRating}/5</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => dispatch(setEditingSuppllierId(supplier._id))}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(supplier._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No suppliers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <SupplierForm
        isOpen={isCreateModalOpen || !!editingSuppllierId}
        onClose={() => {
          dispatch(setCreateSupplierModalOpen(false))
          dispatch(setEditingSuppllierId(null))
        }}
        supplierId={editingSuppllierId || undefined}
      />
    </div>
  )
}
