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
import { AlertCircle, UploadCloud } from "lucide-react"

export function ReportIssueForm() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Report New Issue</h1>
        <p className="text-gray-500 text-sm">Please provide detailed information about the issue so our maintenance team can address it promptly.</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-700 font-semibold">Issue Title<span className="text-red-500 ml-1">*</span></Label>
          <Input 
            id="title" 
            placeholder="e.g., Major leak at Main Distribution Pipe" 
            className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-emerald-500" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Category<span className="text-red-500 ml-1">*</span></Label>
            <Select>
              <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-emerald-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="quality">Water Quality</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="water">Water Supply</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Priority Level<span className="text-red-500 ml-1">*</span></Label>
            <Select>
              <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-emerald-500">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-700 font-semibold">Detailed Description<span className="text-red-500 ml-1">*</span></Label>
          <Textarea 
            id="description" 
            placeholder="Please describe the issue in detail, including any specific location details or visible symptoms..." 
            className="min-h-[120px] rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-emerald-500 resize-y" 
          />
        </div>

        {/* File Upload (Optional Mock) */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Attachments (Photos/Videos)</Label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        </div>

        {/* Mock Alert/Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Important Note</p>
            <p>If this is a health-critical water quality issue, please also immediately contact the emergency dispatch line at (555) 019-9922 after submitting this form.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Button variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            Cancel
          </Button>
          <Button className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            Submit Issue Report
          </Button>
        </div>
      </form>
    </div>
  )
}