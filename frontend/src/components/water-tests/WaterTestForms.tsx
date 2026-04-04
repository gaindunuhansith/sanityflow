import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldAlert, Droplets } from "lucide-react"
import { Link } from "react-router-dom"

export function CreateWaterTestForm() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Log New Water Test</h1>
        <p className="text-gray-500 text-sm">Enter field or lab metrics for water quality compliance checks.</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Test Facility / Tester Name<span className="text-red-500 ml-1">*</span></Label>
            <Input placeholder="e.g., John Doe" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Target Water Source<span className="text-red-500 ml-1">*</span></Label>
            <Select>
              <SelectTrigger className="h-11 rounded-xl bg-white">
                <SelectValue placeholder="Select Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ws-001">WS-001: Primary Aquifer 1</SelectItem>
                <SelectItem value="ws-002">WS-002: Community Tank A</SelectItem>
                <SelectItem value="ws-003">WS-003: River Intake Pump</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">pH Level<span className="text-red-500 ml-1">*</span></Label>
            <Input type="number" step="0.1" placeholder="7.0" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Turbidity (NTU)</Label>
            <Input type="number" step="0.1" placeholder="0.5" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Coliforms<span className="text-red-500 ml-1">*</span></Label>
            <Select>
              <SelectTrigger className="h-11 rounded-xl bg-white">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="negative">Negative (Clean)</SelectItem>
                <SelectItem value="positive">Positive (Contaminated)</SelectItem>
                <SelectItem value="pending">Lab Testing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Overall Test Status<span className="text-red-500 ml-1">*</span></Label>
          <Select defaultValue="pending">
            <SelectTrigger className="h-11 rounded-xl bg-white border-emerald-200">
              <SelectValue placeholder="Final Test Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pass">Pass - Safe to Distribute</SelectItem>
              <SelectItem value="fail">Fail - Contaminated</SelectItem>
              <SelectItem value="pending">Pending Further Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Test Remarks / Observations</Label>
          <Textarea placeholder="Any visual observations or lab notes..." className="min-h-[100px] rounded-xl resize-y" />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
             <p className="font-semibold mb-1">Contamination Protocol</p>
             <p>If you flag a test as "Fail - Contaminated", the water source will automatically be moved to "Standby/Offline" and alert maintenance teams.</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
          <Button variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 asChild">
            <Link to="/water-tests">Cancel</Link>
          </Button>
          <Button className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            Save Test Data
          </Button>
        </div>
      </form>
    </div>
  )
}

export function UpdateWaterTestForm() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Test Record</h1>
        <p className="text-gray-500 text-sm">Add late-arriving lab data (like Coliforms) and finalize the testing report for WQT-104.</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Update Coliform Result<span className="text-red-500 ml-1">*</span></Label>
            <Select defaultValue="negative">
              <SelectTrigger className="h-11 rounded-xl bg-white border-emerald-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="negative">Negative (Clean)</SelectItem>
                <SelectItem value="positive">Positive (Contaminated)</SelectItem>
                <SelectItem value="pending">Still Pending Lab</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Final Test Status<span className="text-red-500 ml-1">*</span></Label>
            <Select defaultValue="pass">
              <SelectTrigger className="h-11 rounded-xl bg-white border-emerald-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pass">Pass - Safe to Distribute</SelectItem>
                <SelectItem value="fail">Fail - Contaminated</SelectItem>
                <SelectItem value="pending">Pending Further Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Update Remarks (Append mode)</Label>
          <Textarea placeholder="Add a new timestamped observation or explanation for final ruling..." className="min-h-[100px] rounded-xl resize-y" />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
          <Button variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 asChild">
             <Link to="/water-tests">Cancel</Link>
          </Button>
          <Button className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            Publish Final Report
          </Button>
        </div>
      </form>
    </div>
  )
}