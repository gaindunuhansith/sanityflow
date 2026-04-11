import React, { useState } from "react"
import { Search, ChevronDown, Pencil, Trash2, AlertTriangle, Hammer, Droplets, MapPin, Loader2, Plus } from "lucide-react"

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
import { useGetIssuesQuery, useCreateIssueMutation, useUpdateIssueMutation, useDeleteIssueMutation } from "@/features/issues/issueApi"
import { format } from "date-fns"
import { toast } from "sonner"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case "infrastructure": return <Hammer className="h-4.5 w-4.5 text-[#0F392B]" />;
    case "logistics": return <MapPin className="h-4.5 w-4.5 text-[#0F392B]" />;
    case "water quality": return <AlertTriangle className="h-4.5 w-4.5 text-[#0F392B]" />;
    case "water shortage": return <Droplets className="h-4.5 w-4.5 text-[#0F392B]" />;
    default: return <AlertTriangle className="h-4.5 w-4.5 text-[#0F392B]" />;
  }
}

export function IssueDashboard() {
  const { data: issuesData, isLoading, error, refetch } = useGetIssuesQuery()
  const [createIssue, { isLoading: isCreating }] = useCreateIssueMutation()
  const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation()
  const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation()
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null)

  // Form states
  const [createIssueType, setCreateIssueType] = useState<'Water Quality' | 'Water Shortage' | 'Infrastructure' | 'Other'>('Water Quality')
  const [createDescription, setCreateDescription] = useState('')
  const [createLocation, setCreateLocation] = useState('')
  const [createPriority, setCreatePriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [createPhoto, setCreatePhoto] = useState('')
  const [createFormError, setCreateFormError] = useState('')

  const [editIssueType, setEditIssueType] = useState<'Water Quality' | 'Water Shortage' | 'Infrastructure' | 'Other'>('Water Quality')
  const [editDescription, setEditDescription] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editPriority, setEditPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [editPhoto, setEditPhoto] = useState('')
  const [editStatus, setEditStatus] = useState<'Pending' | 'In Progress' | 'Resolved'>('Pending')
  const [editAssignedTo, setEditAssignedTo] = useState('')
  const [editResolutionNotes, setEditResolutionNotes] = useState('')
  const [editFormError, setEditFormError] = useState('')

  // Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const rawIssues = issuesData || []
  
  // Apply filtering
  const issues = rawIssues.filter(issue => {
    const matchesSearch = (issue.description || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (issue.location || "").toLowerCase().includes(searchQuery.toLowerCase())
                          
    const matchesCategory = categoryFilter === "all" || (issue.issueType || "").toLowerCase() === categoryFilter.toLowerCase()
    
    const matchesPriority = priorityFilter === "all" || (issue.priority || "").toLowerCase() === priorityFilter.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesPriority
  })

  const toggleExpand = (id: string) => {
    setExpandedIssues(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleDelete = async (id: string) => {
    setIssueToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!issueToDelete) return

    try {
      await deleteIssue(issueToDelete).unwrap()
      toast.success("Issue deleted successfully")
      refetch()
      setDeleteDialogOpen(false)
      setIssueToDelete(null)
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Failed to delete issue"
      console.error("Failed to delete issue:", err)
      alert(`Error: ${errorMessage}`)
      setDeleteDialogOpen(false)
      setIssueToDelete(null)
    }
  }

  const resetCreateForm = () => {
    setCreateIssueType('Water Quality')
    setCreateDescription('')
    setCreateLocation('')
    setCreatePriority('Medium')
    setCreatePhoto('')
    setCreateFormError('')
  }

  const handleCreateIssue = async () => {
    if (!createDescription.trim() || !createLocation.trim()) {
      setCreateFormError('Description and location are required')
      return
    }

    try {
      await createIssue({
        issueType: createIssueType,
        description: createDescription.trim(),
        location: createLocation.trim(),
        priority: createPriority,
        photo: createPhoto || undefined,
      }).unwrap()
      
      resetCreateForm()
      setIsCreateDialogOpen(false)
      refetch()
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to create issue'
      setCreateFormError(errorMessage)
    }
  }

  const openEditDialog = (issueId: string) => {
    const issue = issues.find(i => i._id === issueId)
    if (issue) {
      setEditIssueType(issue.issueType)
      setEditDescription(issue.description)
      setEditLocation(issue.location)
      setEditPriority(issue.priority)
      setEditPhoto(issue.photo || '')
      setEditStatus(issue.status)
      setEditAssignedTo(issue.assignedTo?.name || '')
      setEditResolutionNotes(issue.resolutionNotes || '')
      setEditFormError('')
      setEditingIssueId(issueId)
    }
  }

  const closeEditDialog = () => {
    setEditingIssueId(null)
    setEditFormError('')
  }

  const handleUpdateIssue = async () => {
    if (!editingIssueId || !editDescription.trim() || !editLocation.trim()) {
      setEditFormError('Description and location are required')
      return
    }

    try {
      await updateIssue({
        id: editingIssueId,
        body: {
          issueType: editIssueType,
          description: editDescription.trim(),
          location: editLocation.trim(),
          photo: editPhoto || undefined,
          priority: editPriority,
          status: editStatus,
          assignedTo: editAssignedTo || undefined,
          resolutionNotes: editResolutionNotes || undefined,
        }
      }).unwrap()
      
      closeEditDialog()
      refetch()
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to update issue'
      setEditFormError(errorMessage)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Issue Reports</h1>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-70">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search issues"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>    
              <SelectItem value="water quality">Water Quality</SelectItem>
              <SelectItem value="water shortage">Water Shortage</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("")
              setCategoryFilter("all")
              setPriorityFilter("all")
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
            Report Issue
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#0F392B]" /></div>
        ) : error ? (
          <div className="text-red-500 text-center p-8">Failed to load issues</div>
        ) : issues.length === 0 ? (
          <div className="text-gray-500 text-center p-8">No issues found</div>
        ) : (
          <Table className="w-full text-left">
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="py-4 px-4 font-semibold text-gray-500 text-sm">Issue</TableHead>
                <TableHead className="py-4 px-4 font-semibold text-gray-500 text-sm">Reporter</TableHead>
                <TableHead className="py-4 px-4 font-semibold text-gray-500 text-sm">Category</TableHead>
                <TableHead className="py-4 px-4 font-semibold text-gray-500 text-sm">Priority</TableHead>
                <TableHead className="py-4 px-4 font-semibold text-gray-500 text-sm">Status</TableHead>
                <TableHead className="py-4 px-4 font-semibold text-gray-500 text-sm text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <React.Fragment key={issue._id}>
                  <TableRow className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors" onClick={() => toggleExpand(issue._id)}>
                    <TableCell className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{issue.description.length > 50 ? `${issue.description.substring(0, 50)}...` : issue.description}</span>
                        <span className="text-xs text-gray-500 mt-0.5">{issue.createdAt && format(new Date(issue.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <span className="text-sm text-gray-700 font-medium">{issue.reporter?.name || "Unknown"}</span>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(issue.issueType)}
                        <span className="text-sm text-gray-700 capitalize">{issue.issueType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold capitalize
                        ${issue.priority === "High" ? "bg-red-50 text-red-600" :
                          issue.priority === "Medium" ? "bg-amber-50 text-amber-600" :
                          "bg-blue-50 text-blue-600"}
                      `}>
                        {issue.priority}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold capitalize border
                        ${issue.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          issue.status === "In Progress" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-gray-50 text-gray-700 border-gray-200"}
                      `}>
                        {issue.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => openEditDialog(issue._id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(issue._id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" onClick={() => toggleExpand(issue._id)}>
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedIssues.has(issue._id) ? "rotate-180" : ""}`} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedIssues.has(issue._id) && (
                    <TableRow className="bg-gray-50/50">
                      <TableCell colSpan={6} className="py-4 px-6 border-b border-gray-100">
                        <div className="flex flex-col gap-4">
                          <p className="text-sm text-gray-700">{issue.description}</p>
                          {issue.location && (
                            <p className="text-sm text-gray-600"><span className="font-semibold">Location:</span> {issue.location}</p>
                          )}
                          {issue.resolutionNotes && (
                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Resolution Notes</p>
                              <p className="text-sm text-gray-800">{issue.resolutionNotes}</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create Issue Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Report New Issue</DialogTitle>
            <DialogDescription>Submit a new issue report for review and resolution.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="create-issue-type">Issue Type</Label>
              <Select value={createIssueType} onValueChange={(value: any) => setCreateIssueType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Water Quality">Water Quality</SelectItem>
                  <SelectItem value="Water Shortage">Water Shortage</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-description">Description</Label>
              <Input
                id="create-description"
                value={createDescription}
                onChange={(event) => setCreateDescription(event.target.value)}
                placeholder="Describe the issue in detail"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-location">Location</Label>
              <Input
                id="create-location"
                value={createLocation}
                onChange={(event) => setCreateLocation(event.target.value)}
                placeholder="Where did this issue occur?"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-priority">Priority</Label>
              <Select value={createPriority} onValueChange={(value: any) => setCreatePriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-photo">Photo URL (Optional)</Label>
              <Input
                id="create-photo"
                value={createPhoto}
                onChange={(event) => setCreatePhoto(event.target.value)}
                placeholder="Enter photo URL if available"
              />
            </div>

            {createFormError && <p className="text-sm text-rose-600">{createFormError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateIssue} 
              disabled={isCreating}
              className="bg-[#0F392B] hover:bg-[#0F392B]/90 text-white"
            >
              {isCreating ? "Reporting..." : "Report Issue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Issue Dialog */}
      <Dialog open={!!editingIssueId} onOpenChange={(isOpen) => (!isOpen ? closeEditDialog() : undefined)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Issue</DialogTitle>
            <DialogDescription>Modify all issue details, status, and assignment information.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-issue-type">Issue Type</Label>
              <Select value={editIssueType} onValueChange={(value: any) => setEditIssueType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Water Quality">Water Quality</SelectItem>
                  <SelectItem value="Water Shortage">Water Shortage</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                placeholder="Describe the issue in detail"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={editLocation}
                onChange={(event) => setEditLocation(event.target.value)}
                placeholder="Where did this issue occur?"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={editPriority} onValueChange={(value: any) => setEditPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-photo">Photo URL (Optional)</Label>
              <Input
                id="edit-photo"
                value={editPhoto}
                onChange={(event) => setEditPhoto(event.target.value)}
                placeholder="Enter photo URL if available"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editStatus} onValueChange={(value: any) => setEditStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-assigned-to">Assigned To</Label>
              <Input
                id="edit-assigned-to"
                value={editAssignedTo}
                onChange={(event) => setEditAssignedTo(event.target.value)}
                placeholder="Assign to a team member"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-resolution-notes">Resolution Notes</Label>
              <Input
                id="edit-resolution-notes"
                value={editResolutionNotes}
                onChange={(event) => setEditResolutionNotes(event.target.value)}
                placeholder="Add resolution details"
              />
            </div>

            {editFormError && <p className="text-sm text-rose-600">{editFormError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateIssue} 
              disabled={isUpdating}
              className="bg-[#0F392B] hover:bg-[#0F392B]/90 text-white"
            >
              {isUpdating ? "Updating..." : "Update Issue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Issue"
        isLoading={isDeleting}
      />
    </div>
  )
}
