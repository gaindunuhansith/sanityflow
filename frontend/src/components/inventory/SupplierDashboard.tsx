import { useEffect, useMemo, useState } from "react"
import { Pencil, Plus, RefreshCw, Search, SlidersHorizontal, Trash2 } from "lucide-react"
import {
  useGetSuppliersQuery,
  useDeleteSupplierMutation,
} from "@/features/inventory/supplierApi"
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
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import {
  selectSupplierState,
  resetSupplierFilters,
  setSupplierSearchQuery,
  setCreateSupplierModalOpen,
  setEditingSuppllierId,
  setSupplierPage,
} from "@/features/inventory/supplierSlice"
import { SupplierForm } from "@/components/inventory/SupplierForm"

const LARGE_FETCH_LIMIT = 1000

export function SupplierDashboard() {
  const dispatch = useAppDispatch()
  const { searchQuery, page, limit, isCreateModalOpen, editingSuppllierId } =
    useAppSelector(selectSupplierState)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [ratingFilter, setRatingFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [contactFilter, setContactFilter] = useState<"all" | "complete" | "incomplete">("all")

  const { data: response, isLoading, refetch } = useGetSuppliersQuery({
    page: 1,
    limit: LARGE_FETCH_LIMIT,
  })

  const suppliers = response?.items ?? []

  const filteredSuppliers = useMemo(() => {
    const search = searchQuery.trim().toLowerCase()

    return suppliers.filter((supplier) => {
      if (ratingFilter === "high" && supplier.reliabilityRating < 4) {
        return false
      }

      if (ratingFilter === "medium" && (supplier.reliabilityRating < 2 || supplier.reliabilityRating > 3)) {
        return false
      }

      if (ratingFilter === "low" && supplier.reliabilityRating > 1) {
        return false
      }

      const hasCompleteContact = Boolean(
        supplier.contact?.email?.trim() && supplier.contact?.phone?.trim() && supplier.contact?.address?.trim(),
      )

      if (contactFilter === "complete" && !hasCompleteContact) {
        return false
      }

      if (contactFilter === "incomplete" && hasCompleteContact) {
        return false
      }

      if (!search) {
        return true
      }

      const email = supplier.contact?.email ?? ""
      const phone = supplier.contact?.phone ?? ""
      const address = supplier.contact?.address ?? ""

      return [supplier.name, email, phone, address].some((field) =>
        field.toLowerCase().includes(search),
      )
    })
  }, [suppliers, searchQuery, ratingFilter, contactFilter])

  const totalSuppliers = filteredSuppliers.length
  const totalPages = Math.max(1, Math.ceil(totalSuppliers / limit))

  const paginatedSuppliers = useMemo(() => {
    const start = (page - 1) * limit
    return filteredSuppliers.slice(start, start + limit)
  }, [filteredSuppliers, page, limit])

  useEffect(() => {
    if (page > totalPages) {
      dispatch(setSupplierPage(totalPages))
    }
  }, [dispatch, page, totalPages])

  const [deleteSupplier] = useDeleteSupplierMutation()

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      await deleteSupplier(id)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Supplier Management</h1>
          <p className="text-sm text-gray-500">Manage supplier details, contacts, and reliability ratings.</p>
        </div>
        <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white" onClick={() => void refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-4">
        <p className="text-sm text-gray-500">Total Suppliers</p>
        <p className="text-2xl font-semibold text-gray-900">{totalSuppliers}</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search suppliers"
                className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
                value={searchQuery}
                onChange={(event) => dispatch(setSupplierSearchQuery(event.target.value))}
              />
            </div>
            <Button
              variant="ghost"
              className="h-10 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              onClick={() => {
                dispatch(resetSupplierFilters())
                setRatingFilter("all")
                setContactFilter("all")
              }}
            >
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
            <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-4 font-medium" onClick={() => dispatch(setCreateSupplierModalOpen(true))}>
              <Plus className="mr-2 h-4 w-4" />
              New Supplier
            </Button>
          </div>
        </div>

        {showAdvancedFilters ? (
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 flex flex-wrap items-center gap-3">
            <Select value={ratingFilter} onValueChange={(value) => setRatingFilter(value as "all" | "high" | "medium" | "low") }>
              <SelectTrigger className="w-44 h-10 rounded-xl border-gray-200 bg-white">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="high">High (4-5)</SelectItem>
                <SelectItem value="medium">Medium (2-3)</SelectItem>
                <SelectItem value="low">Low (1)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={contactFilter} onValueChange={(value) => setContactFilter(value as "all" | "complete" | "incomplete") }>
              <SelectTrigger className="w-48 h-10 rounded-xl border-gray-200 bg-white">
                <SelectValue placeholder="Contact Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contacts</SelectItem>
                <SelectItem value="complete">Complete Contact</SelectItem>
                <SelectItem value="incomplete">Incomplete Contact</SelectItem>
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
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Reliability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Loading suppliers...
                  </TableCell>
                </TableRow>
              ) : paginatedSuppliers.length > 0 ? (
                paginatedSuppliers.map((supplier) => (
                  <TableRow key={supplier._id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact?.email || "-"}</TableCell>
                    <TableCell>{supplier.contact?.phone || "-"}</TableCell>
                    <TableCell>{supplier.contact?.address || "-"}</TableCell>
                    <TableCell>{supplier.reliabilityRating}/5</TableCell>
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
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No suppliers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>
            Showing {paginatedSuppliers.length} of {totalSuppliers} suppliers
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => dispatch(setSupplierPage(page - 1))}>
              Previous
            </Button>
            <span>Page {page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => dispatch(setSupplierPage(page + 1))}>
              Next
            </Button>
          </div>
        </div>
      </div>

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
