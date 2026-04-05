import { Fragment, useEffect, useMemo, useState } from "react"
import { ChevronRight, ChevronsUpDown, Download, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AppDispatch, RootState } from "@/store"
import {
  useGetBeneficiariesQuery,
  useCreateBeneficiaryMutation,
  useUpdateBeneficiaryMutation,
  useDeleteBeneficiaryMutation,
  type Beneficiary,
  type BeneficiaryEligibilityStatus,
} from "@/features/beneficiary/beneficiaryApi"
import { distributionApi } from "@/features/distribution/distributionApi"
import {
  collapseBeneficiary,
  clearBeneficiaryFilters,
  setBeneficiarySearchText,
  setBeneficiaryCreateDialogOpen,
  setEligibilityFilter,
  setSelectedBeneficiaryIdForDelete,
  setSelectedBeneficiaryIdForEdit,
  toggleExpandedBeneficiary,
} from "@/features/beneficiary/beneficiarySlice"

const getEligibilityBadgeClass = (status: BeneficiaryEligibilityStatus) => {
  if (status === "Active") {
    return "bg-[#ebf8ee] text-[#4dbd74]"
  }

  return "bg-slate-100 text-slate-600"
}

const getBeneficiaryInitials = (name: string) => {
  const initials = name
    .split(" ")
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return initials || "BF"
}

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

const validateBeneficiaryForm = ({
  name,
  location,
  contact,
  familySize,
}: {
  name: string
  location: string
  contact: string
  familySize: number
}) => {
  if (!name || !location || !contact) {
    return "All fields are required."
  }

  if (name.length < 2) {
    return "Name must be at least 2 characters."
  }

  if (location.length < 2) {
    return "Location must be at least 2 characters."
  }

  if (contact.length < 5) {
    return "Contact must be at least 5 characters."
  }

  if (!Number.isInteger(familySize) || familySize < 1) {
    return "Family size must be a whole number greater than 0."
  }

  return null
}

export function BeneficiaryDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [createName, setCreateName] = useState("")
  const [createLocation, setCreateLocation] = useState("")
  const [createFamilySize, setCreateFamilySize] = useState("1")
  const [createContact, setCreateContact] = useState("")
  const [createEligibilityStatus, setCreateEligibilityStatus] = useState<BeneficiaryEligibilityStatus>("Active")
  const [createFormError, setCreateFormError] = useState("")
  const [editName, setEditName] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [editFamilySize, setEditFamilySize] = useState("1")
  const [editContact, setEditContact] = useState("")
  const [editEligibilityStatus, setEditEligibilityStatus] = useState<BeneficiaryEligibilityStatus>("Active")
  const [editFormError, setEditFormError] = useState("")
  const [deleteFormError, setDeleteFormError] = useState("")
  const {
    searchText,
    eligibilityFilter,
    expandedBeneficiaryIds,
    isCreateDialogOpen,
    selectedBeneficiaryIdForEdit,
    selectedBeneficiaryIdForDelete,
  } = useSelector((state: RootState) => state.beneficiary)

  const queryParams = useMemo(() => {
    return {
      ...(eligibilityFilter !== "all" ? { eligibilityStatus: eligibilityFilter } : {}),
      ...(searchText.trim().length > 0 ? { search: searchText.trim() } : {}),
      page: currentPage,
      limit: pageSize,
    }
  }, [eligibilityFilter, searchText, currentPage, pageSize])

  const {
    data: beneficiaryResponse,
    isLoading,
    isError,
    refetch,
  } = useGetBeneficiariesQuery(queryParams)
  const [createBeneficiary, { isLoading: isCreatingBeneficiary }] = useCreateBeneficiaryMutation()
  const [updateBeneficiary, { isLoading: isUpdatingBeneficiary }] = useUpdateBeneficiaryMutation()
  const [deleteBeneficiary, { isLoading: isDeletingBeneficiary }] = useDeleteBeneficiaryMutation()

  const beneficiaries = beneficiaryResponse?.items ?? []
  const totalBeneficiaries = beneficiaryResponse?.total ?? 0
  const totalPages = beneficiaryResponse?.totalPages ?? 1

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleToggleExpand = (beneficiary: Beneficiary) => {
    dispatch(toggleExpandedBeneficiary(beneficiary._id))
  }

  const selectedEditBeneficiary = useMemo(
    () => beneficiaries.find((beneficiary) => beneficiary._id === selectedBeneficiaryIdForEdit) ?? null,
    [beneficiaries, selectedBeneficiaryIdForEdit]
  )

  const selectedDeleteBeneficiary = useMemo(
    () => beneficiaries.find((beneficiary) => beneficiary._id === selectedBeneficiaryIdForDelete) ?? null,
    [beneficiaries, selectedBeneficiaryIdForDelete]
  )

  const resetCreateForm = () => {
    setCreateName("")
    setCreateLocation("")
    setCreateFamilySize("1")
    setCreateContact("")
    setCreateEligibilityStatus("Active")
    setCreateFormError("")
  }

  const handleCreateDialogChange = (isOpen: boolean) => {
    dispatch(setBeneficiaryCreateDialogOpen(isOpen))

    if (!isOpen) {
      resetCreateForm()
    }
  }

  const handleCreateBeneficiary = async () => {
    const name = createName.trim()
    const location = createLocation.trim()
    const contact = createContact.trim()
    const familySize = Number(createFamilySize)

    const validationError = validateBeneficiaryForm({
      name,
      location,
      contact,
      familySize,
    })

    if (validationError) {
      setCreateFormError(validationError)
      return
    }

    setCreateFormError("")

    try {
      await createBeneficiary({
        name,
        location,
        familySize,
        contact,
        eligibilityStatus: createEligibilityStatus,
      }).unwrap()

      dispatch(distributionApi.util.invalidateTags([{ type: "Beneficiary", id: "LIST" }]))

      dispatch(setBeneficiaryCreateDialogOpen(false))
      resetCreateForm()
    } catch (error) {
      setCreateFormError(getApiErrorMessage(error))
    }
  }

  const openEditDialog = (beneficiaryId: string) => {
    const target = beneficiaries.find((beneficiary) => beneficiary._id === beneficiaryId)
    if (!target) {
      return
    }

    setEditName(target.name)
    setEditLocation(target.location)
    setEditFamilySize(String(target.familySize))
    setEditContact(target.contact)
    setEditEligibilityStatus(target.eligibilityStatus)
    setEditFormError("")
    dispatch(setSelectedBeneficiaryIdForEdit(beneficiaryId))
  }

  const closeEditDialog = () => {
    dispatch(setSelectedBeneficiaryIdForEdit(null))
    setEditFormError("")
  }

  const handleUpdateBeneficiary = async () => {
    if (!selectedBeneficiaryIdForEdit) {
      setEditFormError("Beneficiary is not selected.")
      return
    }

    const name = editName.trim()
    const location = editLocation.trim()
    const contact = editContact.trim()
    const familySize = Number(editFamilySize)

    const validationError = validateBeneficiaryForm({
      name,
      location,
      contact,
      familySize,
    })

    if (validationError) {
      setEditFormError(validationError)
      return
    }

    setEditFormError("")

    try {
      await updateBeneficiary({
        id: selectedBeneficiaryIdForEdit,
        name,
        location,
        familySize,
        contact,
        eligibilityStatus: editEligibilityStatus,
      }).unwrap()

      dispatch(distributionApi.util.invalidateTags([{ type: "Beneficiary", id: "LIST" }]))

      closeEditDialog()
    } catch (error) {
      setEditFormError(getApiErrorMessage(error))
    }
  }

  const openDeleteDialog = (beneficiaryId: string) => {
    setDeleteFormError("")
    dispatch(setSelectedBeneficiaryIdForDelete(beneficiaryId))
  }

  const closeDeleteDialog = () => {
    setDeleteFormError("")
    dispatch(setSelectedBeneficiaryIdForDelete(null))
  }

  const handleDeleteBeneficiary = async () => {
    if (!selectedBeneficiaryIdForDelete) {
      setDeleteFormError("Beneficiary is not selected.")
      return
    }

    setDeleteFormError("")

    try {
      await deleteBeneficiary(selectedBeneficiaryIdForDelete).unwrap()
      dispatch(distributionApi.util.invalidateTags([{ type: "Beneficiary", id: "LIST" }]))
      dispatch(collapseBeneficiary(selectedBeneficiaryIdForDelete))
      closeDeleteDialog()
    } catch (error) {
      setDeleteFormError(getApiErrorMessage(error))
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Beneficiary Management</h1>
        <div className="flex items-center gap-3">
          <Button
            className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-4 font-medium"
            onClick={() => dispatch(setBeneficiaryCreateDialogOpen(true))}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Beneficiary
          </Button>
          <Select defaultValue="this-month">
            <SelectTrigger className="w-32.5 rounded-xl h-10 border-gray-200 bg-white">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-10 w-10 border-gray-200 bg-white"
            onClick={() => void refetch()}
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative w-70">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
              placeholder="Search by name, location, contact, or status"
              value={searchText}
              onChange={(event) => {
                dispatch(setBeneficiarySearchText(event.target.value))
                setCurrentPage(1)
              }}
            />
          </div>

          <Select
            value={eligibilityFilter}
            onValueChange={(value) => {
              dispatch(setEligibilityFilter(value as "all" | BeneficiaryEligibilityStatus))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-44 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Eligibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Eligibility</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            className="h-10 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            onClick={() => {
              dispatch(clearBeneficiaryFilters())
              setCurrentPage(1)
            }}
          >
            Clear Filters
          </Button>
        </div>

        <div className="flex items-center gap-3 xl:ml-auto w-full xl:w-auto justify-end">
          <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-5 font-medium" disabled>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
          Showing {beneficiaries.length} of {totalBeneficiaries} beneficiaries
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <Table className="w-full min-w-[980px] text-left">
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="text-gray-500 font-semibold text-xs w-[34%] py-4 pl-4">Beneficiary</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-44 py-4">Contact</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-44 py-4">Location</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-28 py-4">Family Size</TableHead>
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
            {isLoading ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
                  Loading beneficiaries...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="py-10 text-center text-sm text-red-600">
                  Failed to load beneficiaries. Click the filter icon to retry.
                </TableCell>
              </TableRow>
            ) : beneficiaries.length === 0 ? (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
                  <p className="text-sm font-medium text-gray-700 mb-1">No beneficiaries match your current filters.</p>
                  <p className="text-xs text-gray-500">Try clearing filters or changing the search keyword.</p>
                </TableCell>
              </TableRow>
            ) : (
              beneficiaries.map((beneficiary) => {
                const isExpanded = expandedBeneficiaryIds.includes(beneficiary._id)

                return (
                  <Fragment key={beneficiary._id}>
                    <TableRow
                      className={`group transition-colors border-b ${
                        isExpanded
                          ? "bg-emerald-50/40 hover:bg-emerald-50/60 border-emerald-100"
                          : "hover:bg-gray-50/50 border-gray-50"
                      }`}
                    >
                      <TableCell className="pl-4 py-4">
                        <button
                          onClick={() => handleToggleExpand(beneficiary)}
                          className="flex items-center gap-3 text-left w-full focus:outline-none group"
                        >
                          <ChevronRight
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                              isExpanded ? "rotate-90 text-emerald-600" : "text-gray-400 group-hover:text-emerald-600"
                            }`}
                          />
                          <div className="h-9.5 w-9.5 shrink-0 rounded-full bg-[#c7f7d4] flex items-center justify-center">
                            <span className="text-[12px] font-semibold text-[#0F392B]">{getBeneficiaryInitials(beneficiary.name)}</span>
                          </div>
                          <div className="flex flex-col max-w-[320px]">
                            <span className={`font-semibold text-[13px] truncate pr-4 ${isExpanded ? "text-emerald-900" : "text-gray-900"}`}>
                              {beneficiary.name}
                            </span>
                            <span className="text-[11px] text-gray-500 mt-0.5 truncate pr-4">
                              {beneficiary.location}
                            </span>
                          </div>
                        </button>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-gray-700 py-4">{beneficiary.contact}</TableCell>
                      <TableCell className="text-sm font-medium text-gray-600 py-4">{beneficiary.location}</TableCell>
                      <TableCell className="text-sm font-medium text-gray-600 py-4">{beneficiary.familySize}</TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center justify-center px-3 tracking-wide py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${getEligibilityBadgeClass(
                            beneficiary.eligibilityStatus
                          )}`}
                        >
                          {beneficiary.eligibilityStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => openEditDialog(beneficiary._id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => openDeleteDialog(beneficiary._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {isExpanded ? (
                      <TableRow className="bg-emerald-50/5 border-b border-gray-100 hover:bg-emerald-50/5">
                        <TableCell colSpan={6} className="p-0">
                          <div className="bg-emerald-50/20 border-t border-emerald-100/50 px-8 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Beneficiary ID</p>
                                <p className="text-sm font-medium text-gray-800 break-all">{beneficiary._id}</p>
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Created</p>
                                <p className="text-sm font-medium text-gray-800">{new Date(beneficiary.createdAt).toLocaleDateString("en-US")}</p>
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Updated</p>
                                <p className="text-sm font-medium text-gray-800">{new Date(beneficiary.updatedAt).toLocaleDateString("en-US")}</p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-3">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Records</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-9 w-[92px] rounded-lg border-gray-200 bg-white">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 rounded-lg"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="h-9 rounded-lg"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Beneficiary</DialogTitle>
            <DialogDescription>Add a new beneficiary profile for distribution planning.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="create-beneficiary-name">Name</Label>
              <Input
                id="create-beneficiary-name"
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                placeholder="Beneficiary full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-beneficiary-location">Location</Label>
              <Input
                id="create-beneficiary-location"
                value={createLocation}
                onChange={(event) => setCreateLocation(event.target.value)}
                placeholder="Village, district, or area"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-beneficiary-family-size">Family Size</Label>
              <Input
                id="create-beneficiary-family-size"
                type="number"
                min={1}
                value={createFamilySize}
                onChange={(event) => setCreateFamilySize(event.target.value)}
                placeholder="1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-beneficiary-contact">Contact</Label>
              <Input
                id="create-beneficiary-contact"
                value={createContact}
                onChange={(event) => setCreateContact(event.target.value)}
                placeholder="Phone or contact details"
              />
            </div>

            <div className="grid gap-2">
              <Label>Eligibility Status</Label>
              <Select
                value={createEligibilityStatus}
                onValueChange={(value: BeneficiaryEligibilityStatus) => setCreateEligibilityStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {createFormError ? <p className="text-sm text-rose-600">{createFormError}</p> : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleCreateDialogChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBeneficiary} disabled={isCreatingBeneficiary}>
              {isCreatingBeneficiary ? "Creating..." : "Create Beneficiary"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedBeneficiaryIdForEdit)} onOpenChange={(isOpen) => (!isOpen ? closeEditDialog() : undefined)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Beneficiary</DialogTitle>
            <DialogDescription>Update beneficiary information and eligibility status.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-beneficiary-name">Name</Label>
              <Input
                id="edit-beneficiary-name"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                placeholder="Beneficiary full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-beneficiary-location">Location</Label>
              <Input
                id="edit-beneficiary-location"
                value={editLocation}
                onChange={(event) => setEditLocation(event.target.value)}
                placeholder="Village, district, or area"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-beneficiary-family-size">Family Size</Label>
              <Input
                id="edit-beneficiary-family-size"
                type="number"
                min={1}
                value={editFamilySize}
                onChange={(event) => setEditFamilySize(event.target.value)}
                placeholder="1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-beneficiary-contact">Contact</Label>
              <Input
                id="edit-beneficiary-contact"
                value={editContact}
                onChange={(event) => setEditContact(event.target.value)}
                placeholder="Phone or contact details"
              />
            </div>

            <div className="grid gap-2">
              <Label>Eligibility Status</Label>
              <Select
                value={editEligibilityStatus}
                onValueChange={(value: BeneficiaryEligibilityStatus) => setEditEligibilityStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedEditBeneficiary ? null : (
              <p className="text-sm text-rose-600">Selected beneficiary no longer exists in current list.</p>
            )}
            {editFormError ? <p className="text-sm text-rose-600">{editFormError}</p> : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBeneficiary} disabled={isUpdatingBeneficiary || !selectedEditBeneficiary}>
              {isUpdatingBeneficiary ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedBeneficiaryIdForDelete)} onOpenChange={(isOpen) => (!isOpen ? closeDeleteDialog() : undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Beneficiary</DialogTitle>
            <DialogDescription>
              {selectedDeleteBeneficiary
                ? `Delete ${selectedDeleteBeneficiary.name}? This action cannot be undone.`
                : "Delete this beneficiary? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          {deleteFormError ? <p className="text-sm text-rose-600">{deleteFormError}</p> : null}

          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBeneficiary}
              disabled={isDeletingBeneficiary || !selectedDeleteBeneficiary}
            >
              {isDeletingBeneficiary ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
