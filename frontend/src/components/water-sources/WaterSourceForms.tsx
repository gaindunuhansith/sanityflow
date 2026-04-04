import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Droplet } from "lucide-react"
import { Link } from "react-router-dom"

export function CreateWaterSourceForm() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Water Source</h1>
        <p className="text-gray-500 text-sm">Register a new water well, reservoir, or intake facility into the system.</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Source Name<span className="text-red-500 ml-1">*</span></Label>
            <Input placeholder="e.g., Community Well Alpha" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Type<span className="text-red-500 ml-1">*</span></Label>
            <Select>
              <SelectTrigger className="h-11 rounded-xl bg-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="well">Groundwater Well</SelectItem>
                <SelectItem value="storage">Storage Tank</SelectItem>
                <SelectItem value="surface">Surface Water Intake</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Capacity (Liters)<span className="text-red-500 ml-1">*</span></Label>
            <Input type="number" placeholder="10000" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Location / Coordinates</Label>
            <Input placeholder="Sector 4 or GPS coords" className="h-11 rounded-xl" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Description / Notes</Label>
          <Textarea placeholder="Any particular details..." className="min-h-[100px] rounded-xl resize-y" />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Droplet className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
             <p className="font-semibold mb-1">Testing Requirement</p>
             <p>New water sources must pass a certified water quality test before status can be marked "Active".</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Button variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 asChild">
            <Link to="/water-sources">Cancel</Link>
          </Button>
          <Button className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            Save Source
          </Button>
        </div>
      </form>
    </div>
  )
}

export function UpdateWaterSourceForm() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Water Source</h1>
        <p className="text-gray-500 text-sm">Modify details, update current fill levels, or change operational status.</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Status<span className="text-red-500 ml-1">*</span></Label>
            <Select defaultValue="active">
              <SelectTrigger className="h-11 rounded-xl bg-white border-emerald-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
                <SelectItem value="standby">Standby</SelectItem>
                <SelectItem value="offline">Offline/Decommissioned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Current Level (%)</Label>
            <Input type="number" defaultValue="85" max="100" min="0" className="h-11 rounded-xl" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
          <Button variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 asChild">
             <Link to="/water-sources">Cancel</Link>
          </Button>
          <Button className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            Update Status
          </Button>
        </div>
      </form>
    </div>
  )
}