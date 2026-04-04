import { Search, SlidersHorizontal, Plus, Download, Pencil, Eye, ShieldCheck } from "lucide-react"
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

const MOCK_TESTS = [
  { id: "WQT-101", sourceName: "Primary Aquifer 1", date: "2024-09-25", ph: "7.2", turbidity: "1.5 NTU", coliforms: "Negative", result: "Pass", testedBy: "A. Black" },
  { id: "WQT-102", sourceName: "Sector 4 Well", date: "2024-09-24", ph: "6.5", turbidity: "6.2 NTU", coliforms: "Positive", result: "Fail", testedBy: "C. Williamson" },
  { id: "WQT-103", sourceName: "Emergency Reservoir", date: "2024-09-20", ph: "7.0", turbidity: "0.8 NTU", coliforms: "Negative", result: "Pass", testedBy: "J. Jones" },
  { id: "WQT-104", sourceName: "Community Tank A", date: "2024-09-18", ph: "7.8", turbidity: "2.1 NTU", coliforms: "Pending", result: "Pending", testedBy: "Lab Team" },
]

export function WaterTestDashboard() {
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
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-5 font-medium asChild">
            <Link to="/water-tests/new">
              <span className="flex items-center">
                 <Plus className="mr-2 h-4 w-4" />
                 Log New Test
              </span>
            </Link>
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
              <TableHead className="text-gray-500 font-semibold text-xs py-4 text-center">Coliforms</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs py-4 text-center">Final Result</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs text-right pr-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TESTS.map((test) => (
              <TableRow key={test.id} className="hover:bg-gray-50/50 border-b border-gray-50 transition-colors">
                <TableCell className="pl-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm">
                        {test.sourceName} <span className="text-xs font-normal text-gray-400 ml-1">({test.id})</span>
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        Tested By: {test.testedBy} • {test.date}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                   <div className="flex flex-col gap-1 text-sm text-gray-600">
                      <div><span className="font-semibold text-gray-400 w-16 inline-block">pH:</span> {test.ph}</div>
                      <div><span className="font-semibold text-gray-400 w-16 inline-block">Turbid:</span> {test.turbidity}</div>
                   </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                   {test.coliforms === "Negative" ? (
                     <span className="text-sm font-medium text-emerald-600">Negative</span>
                   ) : test.coliforms === "Positive" ? (
                     <span className="text-sm font-semibold text-red-500">Positive</span>
                   ) : (
                     <span className="text-sm font-medium text-amber-500 animate-pulse">Pending Result</span>
                   )}
                </TableCell>
                <TableCell className="py-4 text-center">
                   {test.result === "Pass" ? (
                     <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-semibold bg-[#ebf8ee] text-[#4dbd74]">Pass</span>
                   ) : test.result === "Fail" ? (
                     <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-semibold bg-red-50 text-red-600">Critical Fail</span>
                   ) : (
                     <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-600">In Progress</span>
                   )}
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600 asChild">
                      <Link to={`/water-tests/edit/${test.id}`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600">
                      <Eye className="h-4 w-4" />
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