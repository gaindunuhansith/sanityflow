import { useState } from "react"
import { Search, Plus, Download, Pencil, Trash2, MapPin, Droplet, Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
import { useGetWaterSourcesQuery, useCreateWaterSourceMutation, useUpdateWaterSourceMutation, useDeleteWaterSourceMutation } from "@/features/water-sources/waterSourceApi"
import { toast } from "sonner"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"

export function WaterSourceDashboard() {
  const { data: sources = [], isLoading, error, refetch } = useGetWaterSourcesQuery()
  const [createWaterSource, { isLoading: isCreating }] = useCreateWaterSourceMutation()
  const [updateWaterSource, { isLoading: isUpdating }] = useUpdateWaterSourceMutation()
  const [deleteWaterSource, { isLoading: isDeleting }] = useDeleteWaterSourceMutation()

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null)

  // Form states
  const [createName, setCreateName] = useState('')
  const [createType, setCreateType] = useState<'well' | 'tap' | 'borehole'>('well')
  const [createLocation, setCreateLocation] = useState('')
  const [createCapacity, setCreateCapacity] = useState('')
  const [createCondition, setCreateCondition] = useState<'Good' | 'Fair' | 'Poor'>('Good')
  const [createIsActive, setCreateIsActive] = useState(true)
  const [createNotes, setCreateNotes] = useState('')
  const [createFormError, setCreateFormError] = useState('')

  const [editName, setEditName] = useState('')
  const [editType, setEditType] = useState<'well' | 'tap' | 'borehole'>('well')
  const [editLocation, setEditLocation] = useState('')
  const [editCapacity, setEditCapacity] = useState('')
  const [editCondition, setEditCondition] = useState<'Good' | 'Fair' | 'Poor'>('Good')
  const [editIsActive, setEditIsActive] = useState(true)
  const [editNotes, setEditNotes] = useState('')
  const [editFormError, setEditFormError] = useState('')

  // Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [conditionFilter, setConditionFilter] = useState("all")

  // Apply filtering
  const filteredSources = sources.filter(source => {
    const matchesSearch = (source.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (source.location || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || (source.type || "").toLowerCase() === typeFilter.toLowerCase()

    const matchesCondition = conditionFilter === "all" || (source.condition || "").toLowerCase() === conditionFilter.toLowerCase()

    return matchesSearch && matchesType && matchesCondition
  })

  const handleDelete = async (id: string) => {
    setSourceToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!sourceToDelete) return

    try {
      await deleteWaterSource(sourceToDelete).unwrap()
      toast.success("Water source deleted successfully")
      refetch()
      setDeleteDialogOpen(false)
      setSourceToDelete(null)
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Failed to delete water source"
      console.error("Failed to delete water source:", err)
      alert(`Error: ${errorMessage}`)
      setDeleteDialogOpen(false)
      setSourceToDelete(null)
    }
  }

  const resetCreateForm = () => {
    setCreateName('')
    setCreateType('well')
    setCreateLocation('')
    setCreateCapacity('')
    setCreateCondition('Good')
    setCreateIsActive(true)
    setCreateNotes('')
    setCreateFormError('')
  }

  const handleCreateWaterSource = async () => {
    if (!createName.trim() || !createLocation.trim() || !createCapacity.trim()) {
      setCreateFormError('Name, location, and capacity are required')
      return
    }

    const capacity = parseFloat(createCapacity)
    if (isNaN(capacity) || capacity <= 0) {
      setCreateFormError('Capacity must be a valid positive number')
      return
    }

    try {
      await createWaterSource({
        name: createName.trim(),
        type: createType,
        location: createLocation.trim(),
        capacity: capacity,
        condition: createCondition,
        isActive: createIsActive,
        notes: createNotes || undefined,
      }).unwrap()

      resetCreateForm()
      setIsCreateDialogOpen(false)
      refetch()
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to create water source'
      setCreateFormError(errorMessage)
    }
  }

  const openEditDialog = (sourceId: string) => {
    const source = sources.find(s => s._id === sourceId)
    if (source) {
      setEditName(source.name)
      setEditType(source.type)
      setEditLocation(source.location)
      setEditCapacity(source.capacity.toString())
      setEditCondition(source.condition)
      setEditIsActive(source.isActive)
      setEditNotes(source.notes || '')
      setEditFormError('')
      setEditingSourceId(sourceId)
    }
  }

  const closeEditDialog = () => {
    setEditingSourceId(null)
    setEditFormError('')
  }

  const handleUpdateWaterSource = async () => {
    if (!editingSourceId || !editName.trim() || !editLocation.trim() || !editCapacity.trim()) {
      setEditFormError('Name, location, and capacity are required')
      return
    }

    const capacity = parseFloat(editCapacity)
    if (isNaN(capacity) || capacity <= 0) {
      setEditFormError('Capacity must be a valid positive number')
      return
    }

    try {
      await updateWaterSource({
        id: editingSourceId,
        body: {
          name: editName.trim(),
          type: editType,
          location: editLocation.trim(),
          capacity: capacity,
          condition: editCondition,
          isActive: editIsActive,
          notes: editNotes || undefined,
        }
      }).unwrap()

      closeEditDialog()
      refetch()
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to update water source'
      setEditFormError(errorMessage)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Water Sources</h1>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-70">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sources"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="well">Well</SelectItem>
              <SelectItem value="tap">Tap</SelectItem>
              <SelectItem value="borehole">Borehole</SelectItem>
            </SelectContent>
          </Select>

          <Select value={conditionFilter} onValueChange={setConditionFilter}>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setTypeFilter("all")
              setConditionFilter("all")
            }}
            className="h-10 rounded-xl border-gray-200 bg-white text-gray-700 font-medium"
          >
            Clear Filters
          </Button>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button
            className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-5 font-medium"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Water Source
          </Button>
          <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white text-gray-700 font-medium">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#0F392B]" /></div>
        ) : error ? (
          <div className="text-red-500 text-center p-8">Failed to load water sources</div>
        ) : filteredSources.length === 0 ? (
          <div className="text-gray-500 text-center p-8">No water sources found</div>
        ) : (
          <Table className="w-full text-left">
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="py-4 px-4 font-semibold text-gray-500 text-sm">Source Details</TableHead>
                <TableHead className="py-4 px-4 font-semibold text-gray-500 text-sm">Capacity</TableHead>
                <TableHead className="py-4 px-4 font-semibold text-gray-500 text-sm">Condition</TableHead>
                <TableHead className="py-4 px-4 font-semibold text-gray-500 text-sm">Status</TableHead>
                <TableHead className="py-4 px-4 font-semibold text-gray-500 text-sm text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources.map((source) => (
                <TableRow key={source._id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors">
                  <TableCell className="pl-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
                        <Droplet className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-sm">
                          {source.name} <span className="text-xs font-normal text-gray-400 ml-1">({source._id.slice(-6)})</span>
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {source.location} • {source.type}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-600 py-4">
                     {source.capacity} L
                  </TableCell>
                  <TableCell className="py-4">
                     <div className="text-sm font-semibold text-gray-700">{source.condition}</div>
                  </TableCell>
                  <TableCell className="py-4">
                     {source.isActive ? (
                       <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600">Active</span>
                     ) : (
                       <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-600">Inactive</span>
                     )}
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-green-600"
                        onClick={() => openEditDialog(source._id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600"
                        onClick={() => handleDelete(source._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create Water Source Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Water Source</DialogTitle>
            <DialogDescription>Create a new water source with all required details.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="create-name">Name</Label>
              <Input
                id="create-name"
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                placeholder="Enter source name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-type">Type</Label>
              <Select value={createType} onValueChange={(value: any) => setCreateType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="well">Well</SelectItem>
                  <SelectItem value="tap">Tap</SelectItem>
                  <SelectItem value="borehole">Borehole</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="create-location">Location</Label>
              <Input
                id="create-location"
                value={createLocation}
                onChange={(event) => setCreateLocation(event.target.value)}
                placeholder="Enter location"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-capacity">Capacity (L)</Label>
              <Input
                id="create-capacity"
                type="number"
                value={createCapacity}
                onChange={(event) => setCreateCapacity(event.target.value)}
                placeholder="Enter capacity"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-condition">Condition</Label>
              <Select value={createCondition} onValueChange={(value: any) => setCreateCondition(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-active">Status</Label>
              <Select value={createIsActive.toString()} onValueChange={(value) => setCreateIsActive(value === 'true')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="create-notes">Notes</Label>
              <Input
                id="create-notes"
                value={createNotes}
                onChange={(event) => setCreateNotes(event.target.value)}
                placeholder="Additional notes (optional)"
              />
            </div>

            {createFormError && <p className="text-sm text-rose-600 col-span-2">{createFormError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateWaterSource}
              disabled={isCreating}
              className="bg-[#0F392B] hover:bg-[#0F392B]/90 text-white"
            >
              {isCreating ? "Creating..." : "Create Source"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Water Source Dialog */}
      <Dialog open={!!editingSourceId} onOpenChange={(isOpen) => (!isOpen ? closeEditDialog() : undefined)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Water Source</DialogTitle>
            <DialogDescription>Modify all water source details.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                placeholder="Enter source name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select value={editType} onValueChange={(value: any) => setEditType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="well">Well</SelectItem>
                  <SelectItem value="tap">Tap</SelectItem>
                  <SelectItem value="borehole">Borehole</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={editLocation}
                onChange={(event) => setEditLocation(event.target.value)}
                placeholder="Enter location"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-capacity">Capacity (L)</Label>
              <Input
                id="edit-capacity"
                type="number"
                value={editCapacity}
                onChange={(event) => setEditCapacity(event.target.value)}
                placeholder="Enter capacity"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-condition">Condition</Label>
              <Select value={editCondition} onValueChange={(value: any) => setEditCondition(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-active">Status</Label>
              <Select value={editIsActive.toString()} onValueChange={(value) => setEditIsActive(value === 'true')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                value={editNotes}
                onChange={(event) => setEditNotes(event.target.value)}
                placeholder="Additional notes (optional)"
              />
            </div>

            {editFormError && <p className="text-sm text-rose-600 col-span-2">{editFormError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateWaterSource}
              disabled={isUpdating}
              className="bg-[#0F392B] hover:bg-[#0F392B]/90 text-white"
            >
              {isUpdating ? "Updating..." : "Update Source"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Water Source"
        isLoading={isDeleting}
      />
    </div>
  )
}