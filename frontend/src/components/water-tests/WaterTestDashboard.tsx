import { useMemo, useState } from "react"
import { Search, SlidersHorizontal, Plus, Download, Pencil, ShieldCheck, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useDeleteWaterTestMutation, useGetWaterTestsQuery } from "@/features/water-tests/waterTestApi"

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return "Invalid date"
  return date.toLocaleDateString()
}

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

export function WaterTestDashboard() {
  const { data: tests, isLoading, error } = useGetWaterTestsQuery()
  const [deleteWaterTest] = useDeleteWaterTestMutation()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTests = useMemo(() => {
    if (!Array.isArray(tests)) return []
    const term = searchTerm.trim().toLowerCase()
    if (!term) return tests

    return tests.filter((test) => {
      const sourceName = getSourceName(test.waterSource).toLowerCase()
      return (
        sourceName.includes(term) ||
        test._id.toLowerCase().includes(term) ||
        test.status.toLowerCase().includes(term)
      )
    })
  }, [searchTerm, tests])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this water test?")) {
      return
    }

    try {
      await deleteWaterTest(id).unwrap()
    } catch (deleteError) {
      console.error("Failed to delete water test", deleteError)
      window.alert("Failed to delete water test. Please try again.")
    }
  }

  if (isLoading) return <div>Loading water tests...</div>
  if (error) return <div>Error loading water tests</div>

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
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600 asChild">
                      <Link to={`/water-tests/edit/${test._id}`}><Pencil className="h-4 w-4" /></Link>
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
    </div>
  )
}