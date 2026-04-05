import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Droplet } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { 
  useCreateWaterSourceMutation, 
  useGetWaterSourceByIdQuery, 
  useUpdateWaterSourceMutation 
} from "@/features/water-sources/waterSourceApi"

export function CreateWaterSourceForm() {
  const navigate = useNavigate()
  const [createWaterSource, { isLoading }] = useCreateWaterSourceMutation()
  
  const [formData, setFormData] = useState({
    name: "",
    type: "well" as "well" | "tap" | "borehole",
    capacity: "",
    location: "",
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createWaterSource({
        name: formData.name,
        type: formData.type,
        capacity: Number(formData.capacity),
        location: formData.location,
        notes: formData.notes,
        condition: "Good",
        isActive: true
      }).unwrap()
      navigate("/water-sources")
    } catch (err) {
      console.error("Failed to create water source", err)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Water Source</h1>
        <p className="text-gray-500 text-sm">Register a new water well, tap, or borehole into the system.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Source Name<span className="text-red-500 ml-1">*</span></Label>
            <Input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Community Well Alpha" 
              className="h-11 rounded-xl" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Type<span className="text-red-500 ml-1">*</span></Label>
            <Select value={formData.type} onValueChange={(val: any) => setFormData({...formData, type: val})}>
              <SelectTrigger className="h-11 rounded-xl bg-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="well">Groundwater Well</SelectItem>
                <SelectItem value="tap">Public Tap</SelectItem>
                <SelectItem value="borehole">Borehole</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Capacity (Liters)<span className="text-red-500 ml-1">*</span></Label>
            <Input 
              required
              type="number" 
              min="0"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              placeholder="10000" 
              className="h-11 rounded-xl" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Location / Coordinates<span className="text-red-500 ml-1">*</span></Label>
            <Input 
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Sector 4 or GPS coords" 
              className="h-11 rounded-xl" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Description / Notes</Label>
          <Textarea 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Any particular details..." 
            className="min-h-[100px] rounded-xl resize-y" 
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Droplet className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
             <p className="font-semibold mb-1">Testing Requirement</p>
             <p>New water sources must pass a certified water quality test before status can be marked "Active".</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 asChild">
            <Link to="/water-sources">Cancel</Link>
          </Button>
          <Button 
            disabled={isLoading}
            type="submit" 
            className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            {isLoading ? "Saving..." : "Save Source"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export function UpdateWaterSourceForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { data: source, isLoading: isFetching } = useGetWaterSourceByIdQuery(id!)
  const [updateWaterSource, { isLoading: isUpdating }] = useUpdateWaterSourceMutation()

  const [formData, setFormData] = useState<{
    isActive: string;
    condition: "Good" | "Fair" | "Poor";
  }>({
    isActive: "true",
    condition: "Good"
  })

  useEffect(() => {
    if (source) {
      setFormData({
        isActive: source.isActive.toString(),
        condition: source.condition
      })
    }
  }, [source])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    try {
      await updateWaterSource({
        id,
        body: {
          isActive: formData.isActive === "true",
          condition: formData.condition
        }
      }).unwrap()
      navigate("/water-sources")
    } catch (err) {
      console.error("Failed to update water source status", err)
    }
  }

  if (isFetching) return <div>Loading...</div>
  if (!source) return <div>Source not found</div>

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Water Source</h1>
        <p className="text-gray-500 text-sm">Modify operational status and physical condition for {source.name}.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Status<span className="text-red-500 ml-1">*</span></Label>
            <Select value={formData.isActive} onValueChange={(val) => setFormData({...formData, isActive: val})}>
              <SelectTrigger className="h-11 rounded-xl bg-white border-emerald-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive / Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Condition<span className="text-red-500 ml-1">*</span></Label>
            <Select value={formData.condition} onValueChange={(val: any) => setFormData({...formData, condition: val})}>
              <SelectTrigger className="h-11 rounded-xl bg-white border-emerald-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
          <Button type="button" variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 asChild">
             <Link to="/water-sources">Cancel</Link>
          </Button>
          <Button 
            disabled={isUpdating}
            type="submit" 
            className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </form>
    </div>
  )
}