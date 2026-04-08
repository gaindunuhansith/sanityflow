import { useState } from "react"
import { Search, Plus, Download, Pencil, Trash2, ShieldCheck, SlidersHorizontal, Cloud, Thermometer, Droplets, Wind } from "lucide-react"

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
import { useGetWaterTestsQuery, useCreateWaterTestMutation, useUpdateWaterTestMutation, useDeleteWaterTestMutation } from "@/features/water-tests/waterTestApi"
import { useGetWaterSourcesQuery } from "@/features/water-sources/waterSourceApi"
import { toast } from "sonner"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"

const getSourceName = (waterSource: unknown) => {
  if (waterSource && typeof waterSource === "object" && "name" in waterSource) {
    return String((waterSource as { name: string }).name)
  }
  return "Unknown Source"
}

const getTesterName = (tester: unknown) => {
  if (tester && typeof tester === "object" && "name" in tester) {
    return String((tester as { name: string }).name)
  }
  return "Unknown Tester"
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function WaterTestDashboard() {
  const { data: tests = [], refetch } = useGetWaterTestsQuery()
  const { data: waterSources = [] } = useGetWaterSourcesQuery()
  const [createWaterTest] = useCreateWaterTestMutation()
  const [updateWaterTest] = useUpdateWaterTestMutation()
  const [deleteWaterTest] = useDeleteWaterTestMutation()

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTestId, setEditingTestId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [testToDelete, setTestToDelete] = useState<string | null>(null)

  // Form states
  const [createWaterSource, setCreateWaterSource] = useState('')
  const [createTestDate, setCreateTestDate] = useState('')
  const [createPH, setCreatePH] = useState('')
  const [createTDS, setCreateTDS] = useState('')
  const [createTurbidity, setCreateTurbidity] = useState('')
  const [createContaminants, setCreateContaminants] = useState('')
  const [createNotes, setCreateNotes] = useState('')
  const [createFormError, setCreateFormError] = useState('')

  const [editPH, setEditPH] = useState('')
  const [editTDS, setEditTDS] = useState('')
  const [editTurbidity, setEditTurbidity] = useState('')
  const [editContaminants, setEditContaminants] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editFormError, setEditFormError] = useState('')

  // Filters State
  const [searchQuery, setSearchQuery] = useState("")

  // Apply filtering
  const filteredTests = tests.filter(test => {
    const matchesSearch = (getSourceName(test.waterSource) || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (test._id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (test.status || "").toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const handleDelete = async (id: string) => {
    setTestToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!testToDelete) return

    try {
      await deleteWaterTest(testToDelete).unwrap()
      toast.success("Water test deleted successfully")
      refetch()
      setDeleteDialogOpen(false)
      setTestToDelete(null)
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Failed to delete water test"
      console.error("Failed to delete water test:", err)
      alert(`Error: ${errorMessage}`)
      setDeleteDialogOpen(false)
      setTestToDelete(null)
    }
  }

  const resetCreateForm = () => {
    setCreateWaterSource('')
    setCreateTestDate('')
    setCreatePH('')
    setCreateTDS('')
    setCreateTurbidity('')
    setCreateContaminants('')
    setCreateNotes('')
    setCreateFormError('')
  }

  const handleCreateWaterTest = async () => {
    if (!createWaterSource.trim() || !createTestDate.trim() || !createPH.trim() || !createTDS.trim() || !createTurbidity.trim()) {
      setCreateFormError('Water source, test date, pH, TDS, and turbidity are required')
      return
    }

    const pH = parseFloat(createPH)
    const tds = parseInt(createTDS)
    const turbidity = parseFloat(createTurbidity)

    if (isNaN(pH) || pH < 0 || pH > 14) {
      setCreateFormError('pH must be a number between 0 and 14')
      return
    }

    if (isNaN(tds) || tds < 0) {
      setCreateFormError('TDS must be a positive number')
      return
    }

    if (isNaN(turbidity) || turbidity < 0) {
      setCreateFormError('Turbidity must be a positive number')
      return
    }

    const contaminants = createContaminants.trim() ? createContaminants.split(',').map(c => c.trim()).filter(c => c) : []

    try {
      await createWaterTest({
        waterSource: createWaterSource,
        pH: pH,
        tds: tds,
        turbidity: turbidity,
        contaminants: contaminants,
        notes: createNotes || undefined,
      }).unwrap()

      resetCreateForm()
      setIsCreateDialogOpen(false)
      refetch()
      toast.success("Water test created successfully")
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to create water test'
      setCreateFormError(errorMessage)
    }
  }

  const openEditDialog = (testId: string) => {
    const test = tests.find(t => t._id === testId)
    if (test) {
      setEditPH(test.pH.toString())
      setEditTDS(test.tds.toString())
      setEditTurbidity(test.turbidity.toString())
      setEditContaminants(test.contaminants.join(', '))
      setEditNotes(test.notes || '')
      setEditFormError('')
      setEditingTestId(testId)
    }
  }

  const closeEditDialog = () => {
    setEditingTestId(null)
    setEditFormError('')
  }

  const handleUpdateWaterTest = async () => {
    if (!editingTestId || !editPH.trim() || !editTDS.trim() || !editTurbidity.trim()) {
      setEditFormError('pH, TDS, and turbidity are required')
      return
    }

    const pH = parseFloat(editPH)
    const tds = parseInt(editTDS)
    const turbidity = parseFloat(editTurbidity)

    if (isNaN(pH) || pH < 0 || pH > 14) {
      setEditFormError('pH must be a number between 0 and 14')
      return
    }

    if (isNaN(tds) || tds < 0) {
      setEditFormError('TDS must be a positive number')
      return
    }

    if (isNaN(turbidity) || turbidity < 0) {
      setEditFormError('Turbidity must be a positive number')
      return
    }

    const contaminants = editContaminants.trim() ? editContaminants.split(',').map(c => c.trim()).filter(c => c) : []

    try {
      await updateWaterTest({
        id: editingTestId,
        body: {
          pH: pH,
          tds: tds,
          turbidity: turbidity,
          contaminants: contaminants,
          notes: editNotes || undefined,
        }
      }).unwrap()

      closeEditDialog()
      refetch()
      toast.success("Water test updated successfully")
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to update water test'
      setEditFormError(errorMessage)
    }
  }

  const handleEdit = (test: any) => {
    openEditDialog(test._id)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Water Quality Tests</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-gray-200 bg-white">
            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-70">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search source or ID"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button
            className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-5 font-medium"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Log New Test
          </Button>
          <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white text-gray-700 font-medium">
            <Download className="mr-2 h-4 w-4" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-gray-100 rounded-xl">
        <Table className="w-full text-left">
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="text-gray-500 font-semibold text-xs py-4 pl-4">Water Source & Date</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs py-4">Key Metrics</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs py-4">Weather Conditions</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs py-4 text-center">Contaminants</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs py-4 text-center">Final Result</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs text-right pr-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTests.map((test) => (
              <TableRow key={test._id} className="hover:bg-gray-50/50 border-b border-gray-50 transition-colors">
                <TableCell className="pl-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm">
                        {getSourceName(test.waterSource)}{" "}
                        <span className="text-xs font-normal text-gray-400 ml-1">({test._id.slice(-6)})</span>
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        Tested By: {getTesterName(test.tester)} • {formatDate(test.testDate)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                   <div className="flex flex-col gap-1 text-sm text-gray-600">
                      <div><span className="font-semibold text-gray-400 w-16 inline-block">pH:</span> {test.pH.toFixed(2)}</div>
                      <div><span className="font-semibold text-gray-400 w-16 inline-block">TDS:</span> {test.tds} ppm</div>
                      <div><span className="font-semibold text-gray-400 w-16 inline-block">Turbid:</span> {test.turbidity} NTU</div>
                   </div>
                </TableCell>
                <TableCell className="py-4">
                  {test.temperature !== undefined ? (
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Thermometer className="h-3 w-3" />
                        <span>{test.temperature.toFixed(1)}°C</span>
                      </div>
                      {test.weatherCondition && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Cloud className="h-3 w-3" />
                          <span className="capitalize">{test.weatherCondition}</span>
                        </div>
                      )}
                      {test.humidity !== undefined && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Droplets className="h-3 w-3" />
                          <span>{test.humidity}% humidity</span>
                        </div>
                      )}
                      {test.windSpeed !== undefined && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Wind className="h-3 w-3" />
                          <span>{test.windSpeed.toFixed(1)} m/s</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">No weather data</span>
                  )}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {test.contaminants.length > 0 ? (
                    <span className="text-sm font-semibold text-red-500">{test.contaminants.join(", ")}</span>
                  ) : (
                    <span className="text-sm font-medium text-emerald-600">None detected</span>
                  )}
                </TableCell>
                <TableCell className="py-4 text-center">
                   {test.status === "Safe" ? (
                     <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-semibold bg-[#ebf8ee] text-[#4dbd74]">Safe</span>
                   ) : (
                     <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-semibold bg-red-50 text-red-600">Unsafe</span>
                   )}
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-emerald-600"
                      onClick={() => handleEdit(test)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-600"
                      onClick={() => handleDelete(test._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Log New Water Quality Test</DialogTitle>
            <DialogDescription>
              Enter the water quality test details below. Weather data will be automatically captured for scientific correlation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="createWaterSource">Water Source *</Label>
                <Select value={createWaterSource} onValueChange={setCreateWaterSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select water source" />
                  </SelectTrigger>
                  <SelectContent>
                    {waterSources.map((source) => (
                      <SelectItem key={source._id} value={source._id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="createTestDate">Test Date *</Label>
                <Input
                  id="createTestDate"
                  type="date"
                  value={createTestDate}
                  onChange={(e) => setCreateTestDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="createPH">pH Level *</Label>
                <Input
                  id="createPH"
                  type="number"
                  step="0.01"
                  min="0"
                  max="14"
                  value={createPH}
                  onChange={(e) => setCreatePH(e.target.value)}
                  placeholder="7.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createTDS">TDS (ppm) *</Label>
                <Input
                  id="createTDS"
                  type="number"
                  min="0"
                  value={createTDS}
                  onChange={(e) => setCreateTDS(e.target.value)}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createTurbidity">Turbidity (NTU) *</Label>
                <Input
                  id="createTurbidity"
                  type="number"
                  step="0.01"
                  min="0"
                  value={createTurbidity}
                  onChange={(e) => setCreateTurbidity(e.target.value)}
                  placeholder="1.0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="createContaminants">Contaminants</Label>
              <Input
                id="createContaminants"
                value={createContaminants}
                onChange={(e) => setCreateContaminants(e.target.value)}
                placeholder="Comma-separated list (e.g., bacteria, heavy metals)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createNotes">Notes</Label>
              <Input
                id="createNotes"
                value={createNotes}
                onChange={(e) => setCreateNotes(e.target.value)}
                placeholder="Additional observations"
              />
            </div>
            {createFormError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {createFormError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateWaterTest}
              className="bg-[#0F392B] hover:bg-[#0F392B]/90"
            >
              Log Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingTestId} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Water Quality Test</DialogTitle>
            <DialogDescription>
              Update the water quality test details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {editingTestId && (() => {
              const test = tests.find(t => t._id === editingTestId)
              return test && test.temperature !== undefined ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    Weather Conditions at Time of Test
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-800">{test.temperature.toFixed(1)}°C</span>
                    </div>
                    {test.weatherCondition && (
                      <div className="flex items-center gap-2">
                        <Cloud className="h-3 w-3 text-blue-600" />
                        <span className="text-blue-800 capitalize">{test.weatherCondition}</span>
                      </div>
                    )}
                    {test.humidity !== undefined && (
                      <div className="flex items-center gap-2">
                        <Droplets className="h-3 w-3 text-blue-600" />
                        <span className="text-blue-800">{test.humidity}% humidity</span>
                      </div>
                    )}
                    {test.windSpeed !== undefined && (
                      <div className="flex items-center gap-2">
                        <Wind className="h-3 w-3 text-blue-600" />
                        <span className="text-blue-800">{test.windSpeed.toFixed(1)} m/s wind</span>
                      </div>
                    )}
                  </div>
                  {test.weatherDescription && (
                    <p className="text-xs text-blue-700 mt-2 italic">{test.weatherDescription}</p>
                  )}
                </div>
              ) : null
            })()}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPH">pH Level *</Label>
                <Input
                  id="editPH"
                  type="number"
                  step="0.01"
                  min="0"
                  max="14"
                  value={editPH}
                  onChange={(e) => setEditPH(e.target.value)}
                  placeholder="7.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTDS">TDS (ppm) *</Label>
                <Input
                  id="editTDS"
                  type="number"
                  min="0"
                  value={editTDS}
                  onChange={(e) => setEditTDS(e.target.value)}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTurbidity">Turbidity (NTU) *</Label>
                <Input
                  id="editTurbidity"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editTurbidity}
                  onChange={(e) => setEditTurbidity(e.target.value)}
                  placeholder="1.0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editContaminants">Contaminants</Label>
              <Input
                id="editContaminants"
                value={editContaminants}
                onChange={(e) => setEditContaminants(e.target.value)}
                placeholder="Comma-separated list (e.g., bacteria, heavy metals)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNotes">Notes</Label>
              <Input
                id="editNotes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Additional observations"
              />
            </div>
            {editFormError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {editFormError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateWaterTest}
              className="bg-[#0F392B] hover:bg-[#0F392B]/90"
            >
              Update Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Water Quality Test"
        description="Are you sure you want to delete this water quality test? This action cannot be undone."
      />
    </div>
  )
}