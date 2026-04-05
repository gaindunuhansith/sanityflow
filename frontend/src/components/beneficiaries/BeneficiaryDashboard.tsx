import { Fragment, useMemo, useState } from "react"
import { ChevronRight, ChevronsUpDown, Pencil, Plus, Search, SlidersHorizontal, Trash2, Users } from "lucide-react"
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

export function BeneficiaryDashboard() {
  const dispatch = useDispatch<AppDispatch>()
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
    if (eligibilityFilter === "all") {
      return undefined
    }

    return { eligibilityStatus: eligibilityFilter }
  }, [eligibilityFilter])

  const {
    data: beneficiaries = [],
    isLoading,
    isError,
    refetch,
  } = useGetBeneficiariesQuery(queryParams)
  const [createBeneficiary, { isLoading: isCreatingBeneficiary }] = useCreateBeneficiaryMutation()
  const [updateBeneficiary, { isLoading: isUpdatingBeneficiary }] = useUpdateBeneficiaryMutation()
  const [deleteBeneficiary, { isLoading: isDeletingBeneficiary }] = useDeleteBeneficiaryMutation()

  const filteredBeneficiaries = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    return beneficiaries.filter((beneficiary) => {
      if (!normalizedSearch) {
        return true
      }

      return (
        beneficiary.name.toLowerCase().includes(normalizedSearch) ||
        beneficiary.location.toLowerCase().includes(normalizedSearch) ||
        beneficiary.contact.toLowerCase().includes(normalizedSearch) ||
        beneficiary.eligibilityStatus.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [beneficiaries, searchText])

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

    if (!name || !location || !contact) {
      setCreateFormError("All fields are required.")
      return
    }

    if (!Number.isInteger(familySize) || familySize < 1) {
      setCreateFormError("Family size must be a whole number greater than 0.")
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

    if (!name || !location || !contact) {
      setEditFormError("All fields are required.")
      return
    }

    if (!Number.isInteger(familySize) || familySize < 1) {
      setEditFormError("Family size must be a whole number greater than 0.")
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
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 text-slate-700"
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <Input
              className="pl-9 h-10 rounded-xl border-slate-200"
              placeholder="Search by name, location, contact, or status"
              value={searchText}
              onChange={(event) => dispatch(setBeneficiarySearchText(event.target.value))}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={eligibilityFilter}
              onValueChange={(value: "all" | BeneficiaryEligibilityStatus) => {
                dispatch(setEligibilityFilter(value))
              }}
            >
              <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white">
                <SlidersHorizontal className="h-4 w-4 text-slate-500 mr-2" />
                <SelectValue placeholder="Eligibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Eligibility</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="h-10 rounded-xl border-slate-200 text-slate-700"
              onClick={() => dispatch(clearBeneficiaryFilters())}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="w-[48px]" />
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Family Size</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-sm text-slate-500">
                  Loading beneficiaries...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-sm text-rose-600">
                  Failed to load beneficiaries.
                </TableCell>
              </TableRow>
            ) : filteredBeneficiaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-sm text-slate-500">
                  No beneficiaries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBeneficiaries.map((beneficiary) => {
                const isExpanded = expandedBeneficiaryIds.includes(beneficiary._id)

                return (
                  <Fragment key={beneficiary._id}>
                    <TableRow className="hover:bg-slate-50/70">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                          onClick={() => handleToggleExpand(beneficiary)}
                        >
                          {isExpanded ? <ChevronsUpDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{beneficiary.name}</TableCell>
                      <TableCell>{beneficiary.location}</TableCell>
                      <TableCell>{beneficiary.familySize}</TableCell>
                      <TableCell>{beneficiary.contact}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getEligibilityBadgeClass(
                            beneficiary.eligibilityStatus
                          )}`}
                        >
                          {beneficiary.eligibilityStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg border-slate-200"
                            onClick={() => openEditDialog(beneficiary._id)}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50"
                            onClick={() => openDeleteDialog(beneficiary._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {isExpanded ? (
                      <TableRow className="bg-slate-50/40">
                        <TableCell colSpan={7} className="py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <p className="text-slate-500 mb-1">Beneficiary ID</p>
                              <p className="font-medium text-slate-900 break-all">{beneficiary._id}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <p className="text-slate-500 mb-1">Created At</p>
                              <p className="font-medium text-slate-900">
                                {new Date(beneficiary.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <p className="text-slate-500 mb-1">Updated At</p>
                              <p className="font-medium text-slate-900">
                                {new Date(beneficiary.updatedAt).toLocaleString()}
                              </p>
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

      {!isLoading && !isError && filteredBeneficiaries.length > 0 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <p>Showing {filteredBeneficiaries.length} beneficiaries</p>
          <p className="inline-flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total loaded: {beneficiaries.length}
          </p>
        </div>
      ) : null}

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
