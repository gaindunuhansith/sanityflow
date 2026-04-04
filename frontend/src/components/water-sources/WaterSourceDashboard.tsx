import { Search, SlidersHorizontal, Plus, Download, Pencil, Trash2, MapPin, Droplet } from "lucide-react"
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

const MOCK_SOURCES = [
  { id: "WS-001", name: "Primary Aquifer 1", type: "Well", capacity: "50,000 L", level: "85%", status: "Active", location: "North Sector" },
  { id: "WS-002", name: "Community Tank A", type: "Storage", capacity: "10,000 L", level: "40%", status: "Active", location: "Sector 2" },
  { id: "WS-003", name: "River Intake Pump", type: "Surface", capacity: "100,000 L/d", level: "N/A", status: "Maintenance", location: "East River" },
  { id: "WS-004", name: "Emergency Reservoir", type: "Storage", capacity: "25,000 L", level: "100%", status: "Standby", location: "Central Hub" },
]

export function WaterSourceDashboard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Water Sources</h1>
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
              placeholder="Search source by name or ID"
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-5 font-medium asChild">
            <Link to="/water-sources/new">
              <span className="flex items-center">
                 <Plus className="mr-2 h-4 w-4" />
                 Add New Source
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
      <div className="overflow-hidden border border-gray-100 rounded-xl">
        <Table className="w-full text-left">
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="text-gray-500 font-semibold text-xs py-4 pl-4">Source Details</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs py-4">Capacity</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs py-4 text-center">Current Level</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs py-4">Status</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs text-right pr-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_SOURCES.map((source) => (
              <TableRow key={source.id} className="hover:bg-gray-50/50 border-b border-gray-50 transition-colors">
                <TableCell className="pl-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
                      <Droplet className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm">
                        {source.name} <span className="text-xs font-normal text-gray-400 ml-1">({source.id})</span>
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> {source.location} • {source.type}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-600 py-4">
                   {source.capacity}
                </TableCell>
                <TableCell className="py-4">
                   <div className="flex items-center justify-center gap-2">
                     <span className="text-sm font-semibold text-gray-700">{source.level}</span>
                     {source.level !== "N/A" && (
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 rounded-full" style={{ width: source.level }} />
                        </div>
                     )}
                   </div>
                </TableCell>
                <TableCell className="py-4">
                   {source.status === "Active" ? (
                     <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600">Active</span>
                   ) : source.status === "Maintenance" ? (
                     <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-600">Maintenance</span>
                   ) : (
                     <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-600">Standby</span>
                   )}
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600 asChild">
                      <Link to={`/water-sources/edit/${source.id}`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}