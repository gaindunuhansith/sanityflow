import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ClipboardEdit, UploadCloud } from "lucide-react"

export function UpdateIssueForm() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
          <ClipboardEdit className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Update Issue Status</h1>
          <p className="text-gray-500 text-sm">Update progress, change status, or reassign this issue.</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Read-only Issue info (mocked) */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">ISS-002</span>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-md text-[11px] font-semibold bg-red-50 text-red-500">
               Open
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-base">Contamination suspected in Sector 4 well</h3>
          <p className="text-sm text-gray-600 mt-1">Water appears cloudy and has abnormal odor.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Current Status<span className="text-red-500 ml-1">*</span></Label>
            <Select defaultValue="in-progress">
              <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-emerald-500">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed / Invalid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Assign To</Label>
            <Select defaultValue="maintenance">
              <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-emerald-500">
                <SelectValue placeholder="Assign team or member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Maintenance Team</SelectItem>
                <SelectItem value="quality-control">Water Quality Lab</SelectItem>
                <SelectItem value="logistics">Logistics Division</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Priority (Optional Upgrade) */}
        <div className="space-y-2 w-full md:w-1/2 md:pr-3">
            <Label className="text-gray-700 font-semibold">Update Priority Level</Label>
            <Select defaultValue="high">
              <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-emerald-500">
                <SelectValue placeholder="Priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
        </div>

        {/* Update Description/Notes */}
        <div className="space-y-2">
          <Label htmlFor="progress-note" className="text-gray-700 font-semibold">Progress Note<span className="text-red-500 ml-1">*</span></Label>
          <Textarea 
            id="progress-note" 
            placeholder="Describe what actions have been taken, any delays, or why the status is changing..." 
            className="min-h-[120px] rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-emerald-500 resize-y" 
          />
        </div>

        {/* Optional Attachments */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Attach Proof of Work / Image</Label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="text-emerald-600 mb-2">
              <UploadCloud className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Upload files here</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Button variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            Cancel
          </Button>
          <Button className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            Save Update
          </Button>
        </div>
      </form>
    </div>
  )
}