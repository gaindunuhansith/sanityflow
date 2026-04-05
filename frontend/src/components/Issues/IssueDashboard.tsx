import React, { useState } from "react"
import { Search, ChevronDown, SlidersHorizontal, Calendar, Download, Pencil, Trash2, AlertTriangle, Hammer, Droplets, MapPin, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { useGetIssuesQuery, useDeleteIssueMutation } from "@/features/issues/issueApi"
import { format } from "date-fns"

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
  const { data: issuesData, isLoading, error } = useGetIssuesQuery()
  const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation()
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())

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
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await deleteIssue(id).unwrap()
      } catch (err) {
        console.error("Failed to delete issue", err)
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Issue Reports</h1>
        <div className="flex items-center gap-3">
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
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white text-gray-700 font-medium">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            1-30 September 2028
            <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
          </Button>
          <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-5 font-medium" asChild>
            <Link to="/issues/new">
              <span className="flex items-center">
                 <AlertTriangle className="mr-2 h-4 w-4" />
                 Report Issue
              </span>
            </Link>
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
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50" asChild>
                            <Link to={`/issues/edit/${issue._id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
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
    </div>
  )
}
