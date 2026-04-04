import React, { useState } from "react"
import { Search, ChevronDown, SlidersHorizontal, Calendar, Download, ChevronRight, Pencil, Trash2, ChevronsUpDown, AlertTriangle, Hammer, Droplets, MapPin } from "lucide-react"
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

const MOCK_ISSUES = [
  {
    id: "iss-001",
    title: "Major leak at Main Distribution Pipe",
    reporter: { name: "Cameron Williamson" },
    category: "infrastructure",
    priority: "critical",
    createdAt: "2024-09-25T11:00:00",
    commentCount: 2,
    description: "Lost approx. 500 liters in the past hour.",
    status: "Open",
    comments: [
      { id: "c1", auther: "Maintenance Team", content: "Team dispatched to location.", createdAt: "2024-09-25T11:15:00" },
      { id: "c2", auther: "Cameron Williamson", content: "Awaiting update from maintenance.", createdAt: "2024-09-25T11:30:00" }
    ]
  },
  {
    id: "iss-002",
    title: "Contamination suspected in Sector 4 well",
    reporter: { name: "Annette Black" },
    category: "quality",
    priority: "high",
    createdAt: "2024-09-24T09:00:00",
    commentCount: 1,
    description: "Water appears cloudy and has abnormal odor.",
    status: "In Progress",
    comments: [
      { id: "c3", auther: "Lab Technician", content: "Samples collected. Results pending.", createdAt: "2024-09-24T09:12:00" }
    ]
  },
  {
    id: "iss-003",
    title: "Delivery truck #5 breakdown",
    reporter: { name: "Jacob Jones" },
    category: "logistics",
    priority: "medium",
    createdAt: "2024-09-24T10:30:00",
    commentCount: 0,
    description: "Engine failure on route to north village.",
    status: "Resolved",
    comments: []
  },
  {
    id: "iss-004",
    title: "Pump recalibration required",
    reporter: { name: "Dianne Russell" },
    category: "infrastructure",
    priority: "low",
    createdAt: "2024-09-23T13:30:00",
    commentCount: 1,
    description: "Pump #2 showing efficiency drop of 5%.",
    status: "Open",
    comments: [
      { id: "c4", auther: "System Admin", content: "Scheduled recalibration for tomorrow.", createdAt: "2024-09-23T14:10:00" }
    ]
  },
  {
    id: "iss-005",
    title: "Routine maintenance overdue - Valve A",
    reporter: { name: "Guy Hawkins" },
    category: "water",
    priority: "low",
    createdAt: "2024-09-23T15:45:00",
    commentCount: 0,
    description: "Valve A hasn't been checked this quarter.",
    status: "Resolved",
    comments: []
  }
]

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "infrastructure": return <Hammer className="h-4.5 w-4.5 text-[#0F392B]" />;
    case "logistics": return <MapPin className="h-4.5 w-4.5 text-[#0F392B]" />;
    case "quality": return <AlertTriangle className="h-4.5 w-4.5 text-[#0F392B]" />;
    case "water": return <Droplets className="h-4.5 w-4.5 text-[#0F392B]" />;
    default: return <AlertTriangle className="h-4.5 w-4.5 text-[#0F392B]" />;
  }
}

export function IssueDashboard() {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())

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
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
            />
          </div>

          <Select>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="quality">Water Quality</SelectItem>
              <SelectItem value="logistics">Logistics</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
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
          <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-5 font-medium asChild">
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
        <Table className="w-full text-left">
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="text-gray-500 font-semibold text-xs w-[45%] py-4 pl-4">Issue Description</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-32 py-4">Reporter</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs text-center w-20 py-4">Updates</TableHead>
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
            {MOCK_ISSUES.map((issue) => {
              const isExpanded = expandedIssues.has(issue.id);

              return (
                <React.Fragment key={issue.id}>
                  <TableRow 
                    className={`group transition-colors border-b ${
                      isExpanded 
                        ? "bg-emerald-50/40 hover:bg-emerald-50/60 border-emerald-100" 
                        : "hover:bg-gray-50/50 border-gray-50"
                    }`}
                  >
                    <TableCell className="pl-4 py-4">
                      <button 
                        onClick={() => toggleExpand(issue.id)} 
                        className="flex items-center gap-3 text-left w-full focus:outline-none group"
                      >
                        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-90 text-emerald-600" : "text-gray-400 group-hover:text-emerald-600"
                        }`} />
                        
                        <div className="h-9.5 w-9.5 shrink-0 rounded-full bg-[#c7f7d4] flex items-center justify-center">
                          {getCategoryIcon(issue.category)}
                        </div>

                        <div className="flex flex-col max-w-50 sm:max-w-62.5 md:max-w-[320px]">
                          <span className={`font-semibold text-[13px] truncate pr-4 ${isExpanded ? "text-emerald-900" : "text-gray-900"}`}>
                            {issue.title}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-0.5 truncate pr-4">
                            <span className="capitalize text-gray-700 mr-1">{issue.category}</span> • Priority: <span className="capitalize">{issue.priority}</span>
                          </span>
                        </div>
                      </button>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 py-4">
                       {issue.reporter?.name}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <span className={issue.commentCount > 0 ? "text-emerald-700 font-semibold" : "text-gray-500 font-medium"}>
                        {issue.commentCount}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      {issue.status === "Resolved" ? (
                        <span className="inline-flex items-center justify-center px-3 tracking-wide py-1 rounded-md text-[11px] font-semibold bg-[#ebf8ee] text-[#4dbd74] whitespace-nowrap">
                          Resolved
                        </span>
                      ) : issue.status === "In Progress" ? (
                        <span className="inline-flex items-center justify-center px-3 tracking-wide py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-500 whitespace-nowrap">
                          In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-3 tracking-wide py-1 rounded-md text-[11px] font-semibold bg-red-50 text-red-500 whitespace-nowrap">
                          Open
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 asChild">
                          <Link to={`/issues/edit/${issue.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Updates Section */}
                  {isExpanded && (
                    <TableRow className="bg-emerald-50/5 border-b border-gray-100 hover:bg-emerald-50/5">
                      <TableCell colSpan={6} className="p-0">
                        <div className="bg-emerald-50/20 border-t border-emerald-100/50">
                          {issue.comments && issue.comments.length > 0 ? (
                            <Table className="w-full text-left">
                              <TableHeader>
                                <TableRow className="border-b border-emerald-100/50 hover:bg-transparent">
                                  <TableHead className="text-gray-500 font-semibold text-xs w-[50%] py-2 pl-12">Update Details</TableHead>
                                  <TableHead className="text-gray-500 font-semibold text-xs w-[20%] py-2">Author</TableHead>
                                  <TableHead className="text-gray-500 font-semibold text-xs w-[20%] py-2">Date/Time</TableHead>
                                  <TableHead className="text-gray-500 font-semibold text-xs w-24 text-right pr-6 py-2">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {issue.comments.map((comment) => {
                                  const date = new Date(comment.createdAt);
                                  const formattedDate = date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })
                                  const formattedTime = date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true })
                                  
                                  return (
                                    <TableRow key={comment.id} className="hover:bg-emerald-50/40 border-b border-emerald-50/50">
                                      <TableCell className="py-3 pl-12 relative overflow-hidden">
                                        <div className="absolute left-6 top-0 bottom-0 w-px bg-emerald-200"></div>
                                        <div className="absolute left-6 top-1/2 w-4 h-px bg-emerald-200 -mt-px"></div>
                                        <p className="text-sm text-gray-700 leading-relaxed max-w-xl pr-4">
                                          {comment.content}
                                        </p>
                                      </TableCell>
                                      <TableCell className="text-sm font-medium text-gray-900 py-3">
                                        {comment.auther}
                                      </TableCell>
                                      <TableCell className="py-3">
                                        <div className="text-sm text-gray-600">{formattedDate}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{formattedTime}</div>
                                      </TableCell>
                                      <TableCell className="text-right pr-6 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50">
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="p-6 text-center border-b border-emerald-100/50">
                              <p className="text-sm text-gray-500">No updates yet for this issue.</p>
                            </div>
                          )}
                          
                          {/* Reply Input Box */}
                          <div className="px-12 py-4 flex gap-3 relative">
                             <div className="absolute left-6 top-0 bottom-0 w-px bg-emerald-200"></div>
                             <div className="absolute left-6 top-7 w-4 h-px bg-emerald-200 -mt-px"></div>
                             <Input placeholder="Type your update..." className="bg-white border-emerald-200 focus-visible:ring-emerald-500 h-10 shadow-sm" />
                             <Button className="bg-[#0F392B] hover:bg-[#0F392B]/90 text-white h-10 shrink-0 px-6 font-medium">
                               Update Status
                             </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
