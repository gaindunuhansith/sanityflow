import React, { useState } from "react"
import { Search, ChevronDown, SlidersHorizontal, Calendar, Download, ChevronRight, Pencil, Trash2, ChevronsUpDown, Droplets, Truck, Package, ShieldCheck } from "lucide-react"

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

const MOCK_THREADS = [
  {
    id: "64a7b1c34a2e5d9c12345671",
    title: "Decrease in tank pressure at the main reservoir",
    author: { name: "Cameron Williamson" },
    tag: "water",
    createdAt: "2024-09-25T11:00:00",
    replyCount: 2,
    content: "Noted a 15% drop in pressure from main tank.",
    status: "Pending",
    replies: [
      { id: "r1", author: "Admin Operations", content: "Dispatching a field technician.", createdAt: "2024-09-25T11:15:00" },
      { id: "r2", author: "Cameron Williamson", content: "Maintaining current pump flow.", createdAt: "2024-09-25T11:30:00" }
    ]
  },
  {
    id: "64a7b1c34a2e5d9c12345672",
    title: "Distribution delay for Sector 4",
    author: { name: "Annette Black" },
    tag: "distributions",
    createdAt: "2024-09-24T09:00:00",
    replyCount: 1,
    content: "Truck broke down. Requesting replacement.",
    status: "Pending",
    replies: [
      { id: "r3", author: "Dispatch Lead", content: "Replacement truck is en route. ETA 45 mins.", createdAt: "2024-09-24T09:12:00" }
    ]
  },
  {
    id: "64a7b1c34a2e5d9c12345673",
    title: "New water quality test guidelines",
    author: { name: "Jacob Jones" },
    tag: "quality",
    createdAt: "2024-09-24T10:30:00",
    replyCount: 0,
    content: "Review attached compliance standards.",
    status: "Completed",
    replies: []
  },
  {
    id: "64a7b1c34a2e5d9c12345674",
    title: "Supplier missing from the directory",
    author: { name: "Dianne Russell" },
    tag: "inventory",
    createdAt: "2024-09-23T13:30:00",
    replyCount: 1,
    content: "Trying to log a batch, Vendor missing.",
    status: "Pending",
    replies: [
      { id: "r4", author: "System Admin", content: "AquaTech is now active. Please retry.", createdAt: "2024-09-23T14:10:00" }
    ]
  },
  {
    id: "64a7b1c34a2e5d9c12345675",
    title: "Routine checkup: Valve #12",
    author: { name: "Guy Hawkins" },
    tag: "water",
    createdAt: "2024-09-23T15:45:00",
    replyCount: 0,
    content: "Standard inspection done.",
    status: "Completed",
    replies: []
  }
]

const getTagIcon = (tag: string) => {
  switch (tag.toLowerCase()) {
    case "water": return <Droplets className="h-4.5 w-4.5 text-[#0F392B]" />;
    case "distributions": return <Truck className="h-4.5 w-4.5 text-[#0F392B]" />;
    case "inventory": return <Package className="h-4.5 w-4.5 text-[#0F392B]" />;
    case "quality": return <ShieldCheck className="h-4.5 w-4.5 text-[#0F392B]" />;
    default: return <Droplets className="h-4.5 w-4.5 text-[#0F392B]" />;
  }
}

export function ForumDashboard() {
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedThreads(prev => {
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
        <h1 className="text-xl font-bold text-gray-900">Recent Threads</h1>
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
              placeholder="Search thread"
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
            />
          </div>

          <Select>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Category</SelectItem>
              <SelectItem value="alerts">Alerts</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              <SelectItem value="open">Emergency</SelectItem>
              <SelectItem value="closed">Community</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white text-gray-700 font-medium">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            1-30 September 2028
            <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
          </Button>
          <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-5 font-medium">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table className="w-full text-left">
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="text-gray-500 font-semibold text-xs w-[45%] py-4 pl-4">Thread</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-32 py-4">Author</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs text-center w-20 py-4">Replies</TableHead>
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
            {MOCK_THREADS.map((thread) => {
              const isExpanded = expandedThreads.has(thread.id);

              return (
                <React.Fragment key={thread.id}>
                  <TableRow 
                    className={`group transition-colors border-b ${
                      isExpanded 
                        ? "bg-emerald-50/40 hover:bg-emerald-50/60 border-emerald-100" 
                        : "hover:bg-gray-50/50 border-gray-50"
                    }`}
                  >
                    <TableCell className="pl-4 py-4">
                      <button 
                        onClick={() => toggleExpand(thread.id)} 
                        className="flex items-center gap-3 text-left w-full focus:outline-none group"
                      >
                        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-90 text-emerald-600" : "text-gray-400 group-hover:text-emerald-600"
                        }`} />
                        
                        <div className="h-9.5 w-9.5 shrink-0 rounded-full bg-[#c7f7d4] flex items-center justify-center">
                          {getTagIcon(thread.tag)}
                        </div>

                        <div className="flex flex-col max-w-50 sm:max-w-62.5 md:max-w-[320px]">
                          <span className={`font-semibold text-[13px] truncate pr-4 ${isExpanded ? "text-emerald-900" : "text-gray-900"}`}>
                            {thread.title}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-0.5 truncate pr-4">
                            <span className="capitalize text-gray-700 mr-1">{thread.tag}</span> • {thread.content}
                          </span>
                        </div>
                      </button>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 py-4">
                       {thread.author?.name}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <span className={thread.replyCount > 0 ? "text-emerald-700 font-semibold" : "text-gray-500 font-medium"}>
                        {thread.replyCount}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      {thread.status === "Completed" ? (
                        <span className="inline-flex items-center justify-center px-3 tracking-wide py-1 rounded-md text-[11px] font-semibold bg-[#ebf8ee] text-[#4dbd74] whitespace-nowrap">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-3 tracking-wide py-1 rounded-md text-[11px] font-semibold bg-red-50 text-red-500 whitespace-nowrap">
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4">
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

                  {/* Expanded Replies Section */}
                  {isExpanded && (
                    <TableRow className="bg-emerald-50/5 border-b border-gray-100 hover:bg-emerald-50/5">
                      <TableCell colSpan={6} className="p-0">
                        <div className="bg-emerald-50/20 border-t border-emerald-100/50">
                          {thread.replies && thread.replies.length > 0 ? (
                            <Table className="w-full text-left">
                              <TableHeader>
                                <TableRow className="border-b border-emerald-100/50 hover:bg-transparent">
                                  <TableHead className="text-gray-500 font-semibold text-xs w-[50%] py-2 pl-12">Reply Content</TableHead>
                                  <TableHead className="text-gray-500 font-semibold text-xs w-[20%] py-2">Author</TableHead>
                                  <TableHead className="text-gray-500 font-semibold text-xs w-[20%] py-2">Date/Time</TableHead>
                                  <TableHead className="text-gray-500 font-semibold text-xs w-24 text-right pr-6 py-2">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {thread.replies.map((reply) => {
                                  const date = new Date(reply.createdAt);
                                  const formattedDate = date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })
                                  const formattedTime = date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true })
                                  
                                  return (
                                    <TableRow key={reply.id} className="hover:bg-emerald-50/40 border-b border-emerald-50/50">
                                      <TableCell className="py-3 pl-12 relative overflow-hidden">
                                        <div className="absolute left-6 top-0 bottom-0 w-px bg-emerald-200"></div>
                                        <div className="absolute left-6 top-1/2 w-4 h-px bg-emerald-200 -mt-px"></div>
                                        <p className="text-sm text-gray-700 leading-relaxed max-w-xl pr-4">
                                          {reply.content}
                                        </p>
                                      </TableCell>
                                      <TableCell className="text-sm font-medium text-gray-900 py-3">
                                        {reply.author}
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
                              <p className="text-sm text-gray-500">No replies yet for this thread.</p>
                            </div>
                          )}
                          
                          {/* Reply Input Box */}
                          <div className="px-12 py-4 flex gap-3 relative">
                             <div className="absolute left-6 top-0 bottom-0 w-px bg-emerald-200"></div>
                             <div className="absolute left-6 top-7 w-4 h-px bg-emerald-200 -mt-px"></div>
                             <Input placeholder="Type your reply..." className="bg-white border-emerald-200 focus-visible:ring-emerald-500 h-10 shadow-sm" />
                             <Button className="bg-[#0F392B] hover:bg-[#0F392B]/90 text-white h-10 shrink-0 px-6 font-medium">
                               Reply
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
