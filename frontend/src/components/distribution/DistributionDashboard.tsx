import { Fragment, useMemo, useState } from "react"
import { Search, SlidersHorizontal, Download, ChevronRight, ChevronsUpDown, Truck, UserPlus, RefreshCw, Trash2, Plus, Users } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AppDispatch, RootState } from "@/store"
import {
  distributionApi,
  useGetDistributionOrdersQuery,
  useGetDriversQuery,
  useGetResourcesQuery,
  useGetBeneficiariesQuery,
  useCreateDistributionOrderMutation,
  useUpdateDistributionOrderMutation,
  useUpdateDeliveryStatusMutation,
  useDeleteDistributionOrderMutation,
  type DistributionOrder,
  type DistributionOrderStatus,
} from "@/features/distribution/distributionApi"
import {
  setSearchText,
  setStatusFilter,
  setDriverFilter,
  clearFilters,
  toggleExpandedOrder,
  collapseOrder,
  setCreateDialogOpen,
  setSelectedOrderIdForAssign,
  setSelectedOrderIdForStatus,
  setSelectedOrderIdForDelete,
} from "@/features/distribution/distributionSlice"

const getStatusBadgeClass = (status: DistributionOrderStatus) => {
  switch (status) {
    case "Pending":
      return "bg-red-50 text-red-500"
    case "Assigned":
      return "bg-blue-50 text-blue-600"
    case "In Transit":
      return "bg-amber-50 text-amber-600"
    case "Delivered":
      return "bg-[#ebf8ee] text-[#4dbd74]"
    case "Failed":
      return "bg-rose-50 text-rose-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

const getDriverName = (order: DistributionOrder) => {
  if (order.driver && typeof order.driver === "object") {
    return order.driver.name
  }
  return "Unassigned"
}

const getCreatedByName = (order: DistributionOrder) => {
  if (order.createdBy && typeof order.createdBy === "object") {
    return order.createdBy.name
  }
  return "Unknown"
}

const getResourceLabel = (order: DistributionOrder, resourceNameById: Map<string, string>) => {
  if (typeof order.resource === "string") {
    return resourceNameById.get(order.resource) ?? order.resource
  }

  if (order.resource && typeof order.resource === "object" && "name" in order.resource) {
    const maybeName = (order.resource as { name?: unknown }).name
    if (typeof maybeName === "string" && maybeName.trim().length > 0) {
      return maybeName
    }
  }

  return "Resource"
}

const getOrderBeneficiaryIds = (order: DistributionOrder) => {
  return (order.beneficiaries ?? []).map((beneficiary) => {
    if (typeof beneficiary === "string") {
      return beneficiary
    }

    return beneficiary._id
  })
}

const getOrderBeneficiaryLabels = (order: DistributionOrder, beneficiaryLabelById: Map<string, string>) => {
  const beneficiaries = order.beneficiaries ?? []

  return beneficiaries.map((beneficiary) => {
    if (typeof beneficiary === "string") {
      return beneficiaryLabelById.get(beneficiary) ?? `Beneficiary ${beneficiary.slice(-6)}`
    }

    return `${beneficiary.name} (${beneficiary.location})`
  })
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

export function DistributionDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const [createResourceId, setCreateResourceId] = useState("")
  const [createQuantity, setCreateQuantity] = useState("1")
  const [createTargetLocation, setCreateTargetLocation] = useState("")
  const [createBeneficiaryIds, setCreateBeneficiaryIds] = useState<string[]>([])
  const [createNotes, setCreateNotes] = useState("")
  const [createFormError, setCreateFormError] = useState("")
  const [assignDriverId, setAssignDriverId] = useState("")
  const [assignError, setAssignError] = useState("")
  const [selectedOrderIdForBeneficiaries, setSelectedOrderIdForBeneficiaries] = useState<string | null>(null)
  const [updateBeneficiaryIds, setUpdateBeneficiaryIds] = useState<string[]>([])
  const [beneficiaryLabelsOverrideByOrder, setBeneficiaryLabelsOverrideByOrder] = useState<Record<string, string[]>>({})
  const [updateBeneficiariesError, setUpdateBeneficiariesError] = useState("")
  const [statusValue, setStatusValue] = useState<"In Transit" | "Delivered" | "Failed">("In Transit")
  const [statusError, setStatusError] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const {
    searchText,
    statusFilter,
    driverFilter,
    expandedOrderIds,
    isCreateDialogOpen,
    selectedOrderIdForAssign,
    selectedOrderIdForStatus,
    selectedOrderIdForDelete,
  } = useSelector((state: RootState) => state.distribution)
  const [beneficiaryFilter, setBeneficiaryFilter] = useState("all")

  const queryParams = useMemo(() => {
    return {
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(driverFilter !== "all" ? { driver: driverFilter } : {}),
      ...(beneficiaryFilter !== "all" ? { beneficiary: beneficiaryFilter } : {}),
    }
  }, [statusFilter, driverFilter, beneficiaryFilter])

  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch,
  } = useGetDistributionOrdersQuery(queryParams)

  const { data: drivers = [] } = useGetDriversQuery()
  const { data: resources = [], isLoading: isResourcesLoading } = useGetResourcesQuery()
  const { data: beneficiaries = [], isLoading: isBeneficiariesLoading } = useGetBeneficiariesQuery({ eligibilityStatus: "Active" })
  const [createDistributionOrder, { isLoading: isCreatingOrder }] = useCreateDistributionOrderMutation()
  const [updateDistributionOrder, { isLoading: isUpdatingOrder }] = useUpdateDistributionOrderMutation()
  const [updateDeliveryStatus, { isLoading: isUpdatingStatus }] = useUpdateDeliveryStatusMutation()
  const [deleteDistributionOrder, { isLoading: isDeletingOrder }] = useDeleteDistributionOrderMutation()

  const resourceNameById = useMemo(() => {
    return new Map(resources.map((resource) => [resource._id, resource.name]))
  }, [resources])

  const beneficiaryLabelById = useMemo(() => {
    return new Map(
      beneficiaries.map((beneficiary) => [beneficiary._id, `${beneficiary.name} (${beneficiary.location})`])
    )
  }, [beneficiaries])

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    return orders.filter((order) => {
      if (normalizedSearch.length === 0) {
        return true
      }

      const targetLocation = order.targetLocation.toLowerCase()
      const notes = (order.notes ?? "").toLowerCase()
      const driverName = getDriverName(order).toLowerCase()
      const resourceText = getResourceLabel(order, resourceNameById).toLowerCase()

      return (
        order._id.toLowerCase().includes(normalizedSearch) ||
        targetLocation.includes(normalizedSearch) ||
        notes.includes(normalizedSearch) ||
        driverName.includes(normalizedSearch) ||
        resourceText.includes(normalizedSearch)
      )
    })
  }, [orders, searchText, resourceNameById])

  const availableDrivers = useMemo(() => {
    return drivers
      .map((driver) => ({
        value: driver.userId,
        label: driver.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [drivers])

  const selectedAssignOrder = useMemo(
    () => orders.find((order) => order._id === selectedOrderIdForAssign) ?? null,
    [orders, selectedOrderIdForAssign]
  )

  const selectedStatusOrder = useMemo(
    () => orders.find((order) => order._id === selectedOrderIdForStatus) ?? null,
    [orders, selectedOrderIdForStatus]
  )

  const selectedBeneficiariesOrder = useMemo(
    () => orders.find((order) => order._id === selectedOrderIdForBeneficiaries) ?? null,
    [orders, selectedOrderIdForBeneficiaries]
  )

  const selectedDeleteOrder = useMemo(
    () => orders.find((order) => order._id === selectedOrderIdForDelete) ?? null,
    [orders, selectedOrderIdForDelete]
  )

  const resetCreateForm = () => {
    setCreateResourceId("")
    setCreateQuantity("1")
    setCreateTargetLocation("")
    setCreateBeneficiaryIds([])
    setCreateNotes("")
    setCreateFormError("")
  }

  const toggleCreateBeneficiary = (beneficiaryId: string) => {
    if (createFormError) {
      setCreateFormError("")
    }

    setCreateBeneficiaryIds((current) => {
      if (current.includes(beneficiaryId)) {
        return current.filter((id) => id !== beneficiaryId)
      }

      return [...current, beneficiaryId]
    })
  }

  const handleCreateDialogChange = (isOpen: boolean) => {
    dispatch(setCreateDialogOpen(isOpen))

    if (!isOpen) {
      resetCreateForm()
    }
  }

  const handleCreateOrder = async () => {
    const parsedQuantity = Number(createQuantity)
    const targetLocation = createTargetLocation.trim()
    const notes = createNotes.trim()

    if (!createResourceId) {
      setCreateFormError("Please select a resource.")
      return
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
      setCreateFormError("Quantity must be at least 1.")
      return
    }

    if (!targetLocation) {
      setCreateFormError("Target location is required.")
      return
    }

    if (createBeneficiaryIds.length === 0) {
      setCreateFormError("Please select at least one beneficiary.")
      return
    }

    setCreateFormError("")

    try {
      await createDistributionOrder({
        resource: createResourceId,
        quantity: parsedQuantity,
        targetLocation,
        ...(createBeneficiaryIds.length > 0 ? { beneficiaries: createBeneficiaryIds } : {}),
        ...(notes ? { notes } : {}),
      }).unwrap()

      await refetch()

      dispatch(setCreateDialogOpen(false))
      resetCreateForm()
    } catch (error) {
      setCreateFormError(getApiErrorMessage(error))
    }
  }

  const openAssignDialog = (order: DistributionOrder) => {
    const currentDriverId = order.driver && typeof order.driver === "object" ? order.driver._id : ""
    setAssignDriverId(currentDriverId)
    setAssignError("")
    dispatch(setSelectedOrderIdForAssign(order._id))
  }

  const closeAssignDialog = () => {
    dispatch(setSelectedOrderIdForAssign(null))
    setAssignDriverId("")
    setAssignError("")
  }

  const handleAssignDriver = async () => {
    if (!selectedOrderIdForAssign) {
      setAssignError("Order is not selected.")
      return
    }

    if (!assignDriverId) {
      setAssignError("Please select a driver.")
      return
    }

    setAssignError("")

    try {
      await updateDistributionOrder({
        id: selectedOrderIdForAssign,
        driver: assignDriverId,
      }).unwrap()

      closeAssignDialog()
    } catch (error) {
      setAssignError(getApiErrorMessage(error))
    }
  }

  const toggleUpdateBeneficiary = (beneficiaryId: string) => {
    if (updateBeneficiariesError) {
      setUpdateBeneficiariesError("")
    }

    setUpdateBeneficiaryIds((current) => {
      if (current.includes(beneficiaryId)) {
        return current.filter((id) => id !== beneficiaryId)
      }

      return [...current, beneficiaryId]
    })
  }

  const openBeneficiariesDialog = (order: DistributionOrder) => {
    setSelectedOrderIdForBeneficiaries(order._id)
    setUpdateBeneficiaryIds(getOrderBeneficiaryIds(order))
    setUpdateBeneficiariesError("")
  }

  const closeBeneficiariesDialog = () => {
    setSelectedOrderIdForBeneficiaries(null)
    setUpdateBeneficiaryIds([])
    setUpdateBeneficiariesError("")
  }

  const handleUpdateBeneficiaries = async () => {
    if (!selectedOrderIdForBeneficiaries) {
      setUpdateBeneficiariesError("Order is not selected.")
      return
    }

    if (updateBeneficiaryIds.length === 0) {
      setUpdateBeneficiariesError("Please select at least one beneficiary.")
      return
    }

    setUpdateBeneficiariesError("")

    const selectedLabels = beneficiaries
      .filter((beneficiary) => updateBeneficiaryIds.includes(beneficiary._id))
      .map((beneficiary) => `${beneficiary.name} (${beneficiary.location})`)

    const fallbackLabels =
      selectedLabels.length > 0
        ? selectedLabels
        : updateBeneficiaryIds.map((id) => beneficiaryLabelById.get(id) ?? `Beneficiary ${id.slice(-6)}`)

    try {
      await updateDistributionOrder({
        id: selectedOrderIdForBeneficiaries,
        beneficiaries: updateBeneficiaryIds,
      }).unwrap()

      setBeneficiaryLabelsOverrideByOrder((current) => ({
        ...current,
        [selectedOrderIdForBeneficiaries]: fallbackLabels,
      }))

      // Keep table UI in sync immediately after assignment.
      dispatch(
        distributionApi.util.updateQueryData("getDistributionOrders", queryParams, (draft) => {
          const targetOrder = draft.find((order) => order._id === selectedOrderIdForBeneficiaries)
          if (!targetOrder) {
            return
          }

          targetOrder.beneficiaries = beneficiaries
            .filter((beneficiary) => updateBeneficiaryIds.includes(beneficiary._id))
            .map((beneficiary) => ({
              _id: beneficiary._id,
              name: beneficiary.name,
              location: beneficiary.location,
              familySize: beneficiary.familySize,
              contact: beneficiary.contact,
              eligibilityStatus: beneficiary.eligibilityStatus,
              createdAt: beneficiary.createdAt,
              updatedAt: beneficiary.updatedAt,
            }))
        })
      )

      await refetch()

      closeBeneficiariesDialog()
    } catch (error) {
      setUpdateBeneficiariesError(getApiErrorMessage(error))
    }
  }

  const openStatusDialog = (order: DistributionOrder) => {
    const allowedStatuses: Array<"In Transit" | "Delivered" | "Failed"> = ["In Transit", "Delivered", "Failed"]
    if (allowedStatuses.includes(order.status as "In Transit" | "Delivered" | "Failed")) {
      setStatusValue(order.status as "In Transit" | "Delivered" | "Failed")
    } else {
      setStatusValue("In Transit")
    }

    setStatusError("")
    dispatch(setSelectedOrderIdForStatus(order._id))
  }

  const closeStatusDialog = () => {
    dispatch(setSelectedOrderIdForStatus(null))
    setStatusValue("In Transit")
    setStatusError("")
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrderIdForStatus) {
      setStatusError("Order is not selected.")
      return
    }

    setStatusError("")

    try {
      await updateDeliveryStatus({
        id: selectedOrderIdForStatus,
        status: statusValue,
      }).unwrap()

      closeStatusDialog()
    } catch (error) {
      setStatusError(getApiErrorMessage(error))
    }
  }

  const openDeleteDialog = (order: DistributionOrder) => {
    setDeleteError("")
    dispatch(setSelectedOrderIdForDelete(order._id))
  }

  const closeDeleteDialog = () => {
    dispatch(setSelectedOrderIdForDelete(null))
    setDeleteError("")
  }

  const handleDeleteOrder = async () => {
    if (!selectedOrderIdForDelete) {
      setDeleteError("Order is not selected.")
      return
    }

    setDeleteError("")

    try {
      await deleteDistributionOrder(selectedOrderIdForDelete).unwrap()
      dispatch(collapseOrder(selectedOrderIdForDelete))
      closeDeleteDialog()
    } catch (error) {
      setDeleteError(getApiErrorMessage(error))
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Distribution Orders</h1>
        <div className="flex items-center gap-3">
          <Button
            className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-4 font-medium"
            onClick={() => dispatch(setCreateDialogOpen(true))}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Order
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
          <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-gray-200 bg-white" onClick={() => void refetch()}>
            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Distribution Order</DialogTitle>
            <DialogDescription>
              Create a new order using available resources from inventory.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resourceName">Resource</Label>
              <Select value={createResourceId} onValueChange={setCreateResourceId}>
                <SelectTrigger id="resourceName" className="w-full">
                  <SelectValue placeholder={isResourcesLoading ? "Loading resources..." : "Select resource"} />
                </SelectTrigger>
                <SelectContent>
                  {resources.length === 0 && !isResourcesLoading && (
                    <SelectItem value="no-resource" disabled>
                      No resources available
                    </SelectItem>
                  )}
                  {resources.map((resource) => (
                    <SelectItem key={resource._id} value={resource._id}>
                      {resource.name} ({resource.quantity} {resource.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={createQuantity}
                onChange={(event) => setCreateQuantity(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetLocation">Target Location</Label>
              <Input
                id="targetLocation"
                value={createTargetLocation}
                onChange={(event) => setCreateTargetLocation(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Beneficiaries</Label>
              <div className="max-h-40 overflow-auto rounded-md border border-gray-200 px-3 py-2 space-y-2">
                {isBeneficiariesLoading && (
                  <p className="text-xs text-gray-500">Loading beneficiaries...</p>
                )}

                {!isBeneficiariesLoading && beneficiaries.length === 0 && (
                  <p className="text-xs text-gray-500">No active beneficiaries found.</p>
                )}

                {!isBeneficiariesLoading && beneficiaries.map((beneficiary) => {
                  const checked = createBeneficiaryIds.includes(beneficiary._id)

                  return (
                    <label key={beneficiary._id} className="flex items-start gap-2 cursor-pointer">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleCreateBeneficiary(beneficiary._id)}
                      />
                      <span className="text-sm text-gray-700">
                        {beneficiary.name} ({beneficiary.location})
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="text-xs text-gray-500">
                Selected: {createBeneficiaryIds.length} (minimum 1)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={createNotes}
                onChange={(event) => setCreateNotes(event.target.value)}
              />
            </div>
            {createFormError && (
              <p className="text-sm text-red-600">{createFormError}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleCreateDialogChange(false)} disabled={isCreatingOrder}>
              Cancel
            </Button>
            <Button className="bg-[#0F392B] hover:bg-[#0F392B]/90 text-white" onClick={() => void handleCreateOrder()} disabled={isCreatingOrder || isResourcesLoading || isBeneficiariesLoading || beneficiaries.length === 0}>
              {isCreatingOrder ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedOrderIdForAssign)} onOpenChange={(isOpen) => { if (!isOpen) closeAssignDialog() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Driver</DialogTitle>
            <DialogDescription>
              Select a driver for order {selectedAssignOrder?._id ?? ""}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Label htmlFor="assign-driver">Driver</Label>
            <Select value={assignDriverId} onValueChange={setAssignDriverId}>
              <SelectTrigger id="assign-driver" className="w-full">
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.length === 0 && (
                  <SelectItem value="no-driver" disabled>
                    No drivers available
                  </SelectItem>
                )}
                {availableDrivers.map((driver) => (
                  <SelectItem key={driver.value} value={driver.value}>
                    {driver.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {assignError && <p className="text-sm text-red-600">{assignError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeAssignDialog} disabled={isUpdatingOrder}>
              Cancel
            </Button>
            <Button className="bg-[#0F392B] hover:bg-[#0F392B]/90 text-white" onClick={() => void handleAssignDriver()} disabled={isUpdatingOrder || availableDrivers.length === 0}>
              {isUpdatingOrder ? "Assigning..." : "Assign Driver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedOrderIdForBeneficiaries)} onOpenChange={(isOpen) => { if (!isOpen) closeBeneficiariesDialog() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Beneficiaries</DialogTitle>
            <DialogDescription>
              Update beneficiaries for order {selectedBeneficiariesOrder?._id ?? ""}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Label>Beneficiaries</Label>
            <div className="max-h-48 overflow-auto rounded-md border border-gray-200 px-3 py-2 space-y-2">
              {isBeneficiariesLoading && (
                <p className="text-xs text-gray-500">Loading beneficiaries...</p>
              )}

              {!isBeneficiariesLoading && beneficiaries.length === 0 && (
                <p className="text-xs text-gray-500">No active beneficiaries found.</p>
              )}

              {!isBeneficiariesLoading && beneficiaries.map((beneficiary) => {
                const checked = updateBeneficiaryIds.includes(beneficiary._id)

                return (
                  <label key={beneficiary._id} className="flex items-start gap-2 cursor-pointer">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleUpdateBeneficiary(beneficiary._id)}
                    />
                    <span className="text-sm text-gray-700">{beneficiary.name} ({beneficiary.location})</span>
                  </label>
                )
              })}
            </div>
            <p className="text-xs text-gray-500">Selected: {updateBeneficiaryIds.length} (minimum 1)</p>
            {updateBeneficiariesError && <p className="text-sm text-red-600">{updateBeneficiariesError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeBeneficiariesDialog} disabled={isUpdatingOrder}>
              Cancel
            </Button>
            <Button className="bg-[#0F392B] hover:bg-[#0F392B]/90 text-white" onClick={() => void handleUpdateBeneficiaries()} disabled={isUpdatingOrder || isBeneficiariesLoading}>
              {isUpdatingOrder ? "Updating..." : "Update Beneficiaries"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedOrderIdForStatus)} onOpenChange={(isOpen) => { if (!isOpen) closeStatusDialog() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
            <DialogDescription>
              Update status for order {selectedStatusOrder?._id ?? ""}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Label htmlFor="update-status">Status</Label>
            <Select value={statusValue} onValueChange={(value) => setStatusValue(value as "In Transit" | "Delivered" | "Failed")}>
              <SelectTrigger id="update-status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            {statusError && <p className="text-sm text-red-600">{statusError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeStatusDialog} disabled={isUpdatingStatus}>
              Cancel
            </Button>
            <Button className="bg-[#0F392B] hover:bg-[#0F392B]/90 text-white" onClick={() => void handleUpdateStatus()} disabled={isUpdatingStatus}>
              {isUpdatingStatus ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedOrderIdForDelete)} onOpenChange={(isOpen) => { if (!isOpen) closeDeleteDialog() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Distribution Order</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Delete order {selectedDeleteOrder?._id ?? ""}?
            </DialogDescription>
          </DialogHeader>

          {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}

          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog} disabled={isDeletingOrder}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDeleteOrder()}
              disabled={isDeletingOrder}
            >
              {isDeletingOrder ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative w-70">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search order"
              value={searchText}
              onChange={(event) => dispatch(setSearchText(event.target.value))}
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => dispatch(setStatusFilter(value as "all" | DistributionOrderStatus))}
          >
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Transit">In Transit</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={driverFilter} onValueChange={(value) => dispatch(setDriverFilter(value))}>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Drivers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers</SelectItem>
              {availableDrivers.map((driver) => (
                <SelectItem key={driver.value} value={driver.value}>
                  {driver.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={beneficiaryFilter} onValueChange={setBeneficiaryFilter}>
            <SelectTrigger className="w-44 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Beneficiaries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Beneficiaries</SelectItem>
              {beneficiaries.map((beneficiary) => (
                <SelectItem key={beneficiary._id} value={beneficiary._id}>
                  {beneficiary.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            className="h-10 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            onClick={() => {
              dispatch(clearFilters())
              setBeneficiaryFilter("all")
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
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <Table className="w-full min-w-[980px] text-left">
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="text-gray-500 font-semibold text-xs w-[38%] py-4 pl-4">Order</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-24 py-4">Quantity</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-44 py-4">Target Location</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-28 py-4">
                <div className="flex items-center justify-between">
                  Status
                  <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />
                </div>
              </TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-32 py-4">Driver</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs text-right pr-6 w-24 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isOrdersLoading && (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
                  Loading distribution orders...
                </TableCell>
              </TableRow>
            )}

            {!isOrdersLoading && isOrdersError && (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="py-10 text-center text-sm text-red-600">
                  Failed to load orders. Click the filter icon to retry.
                </TableCell>
              </TableRow>
            )}

            {!isOrdersLoading && !isOrdersError && filteredOrders.map((order) => {
              const isExpanded = expandedOrderIds.includes(order._id)
              const createdAt = new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
              const beneficiaryLabelsFromOrder = getOrderBeneficiaryLabels(order, beneficiaryLabelById)
              const beneficiaryLabels =
                beneficiaryLabelsFromOrder.length > 0
                  ? beneficiaryLabelsFromOrder
                  : (beneficiaryLabelsOverrideByOrder[order._id] ?? [])
              const beneficiarySummary =
                beneficiaryLabels.length > 0
                  ? beneficiaryLabels.slice(0, 2).join(", ")
                  : "No beneficiaries linked"

              return (
                <Fragment key={order._id}>
                  <TableRow
                    className={`group transition-colors border-b ${
                      isExpanded
                        ? "bg-emerald-50/40 hover:bg-emerald-50/60 border-emerald-100"
                        : "hover:bg-gray-50/50 border-gray-50"
                    }`}
                  >
                    <TableCell className="pl-4 py-4">
                      <button
                        onClick={() => dispatch(toggleExpandedOrder(order._id))}
                        className="flex items-center gap-3 text-left w-full focus:outline-none group"
                      >
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            isExpanded ? "rotate-90 text-emerald-600" : "text-gray-400 group-hover:text-emerald-600"
                          }`}
                        />
                        <div className="h-9.5 w-9.5 shrink-0 rounded-full bg-[#c7f7d4] flex items-center justify-center">
                          <Truck className="h-4.5 w-4.5 text-[#0F392B]" />
                        </div>
                        <div className="flex flex-col max-w-[320px]">
                          <span className={`font-semibold text-[13px] truncate pr-4 ${isExpanded ? "text-emerald-900" : "text-gray-900"}`}>
                            {order._id}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-0.5 truncate pr-4">
                            {getResourceLabel(order, resourceNameById)} | {createdAt}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-0.5 truncate pr-4">
                            {beneficiarySummary}
                          </span>
                        </div>
                      </button>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-700 py-4">{order.quantity}</TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 py-4">{order.targetLocation}</TableCell>
                    <TableCell className="py-4">
                      <span className={`inline-flex items-center justify-center px-3 tracking-wide py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 py-4">{getDriverName(order)}</TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                          title="Assign Driver"
                          onClick={() => openAssignDialog(order)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Update Beneficiaries"
                          onClick={() => openBeneficiariesDialog(order)}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          title="Update Status"
                          onClick={() => openStatusDialog(order)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete Order"
                          onClick={() => openDeleteDialog(order)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow className="bg-emerald-50/5 border-b border-gray-100 hover:bg-emerald-50/5">
                      <TableCell colSpan={6} className="p-0">
                        <div className="bg-emerald-50/20 border-t border-emerald-100/50 px-8 py-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Created By</p>
                              <p className="text-sm font-medium text-gray-800">{getCreatedByName(order)}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Driver</p>
                              <p className="text-sm font-medium text-gray-800">{getDriverName(order)}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Order ID</p>
                              <p className="text-sm font-medium text-gray-800">{order._id}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Notes</p>
                            <p className="text-sm text-gray-700">{order.notes ?? "No notes provided."}</p>
                          </div>

                          <div className="mb-2">
                            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Beneficiaries</p>
                            {beneficiaryLabels.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {beneficiaryLabels.map((label) => (
                                  <span key={`${order._id}-${label}`} className="inline-flex items-center rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1">
                                    {label}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600">No beneficiaries linked.</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })}

            {!isOrdersLoading && !isOrdersError && filteredOrders.length === 0 && (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
                  <p className="text-sm font-medium text-gray-700 mb-1">No orders match your current filters.</p>
                  <p className="text-xs text-gray-500">Try clearing filters or changing the search keyword.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
