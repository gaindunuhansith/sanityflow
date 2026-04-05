import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Droplet } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useCreateWaterSourceMutation, useUpdateWaterSourceMutation, useGetWaterSourceByIdQuery } from "@/features/water-sources/waterSourceApi"

export function CreateWaterSourceForm() {
  const navigate = useNavigate()
  const [createWaterSource, { isLoading }] = useCreateWaterSourceMutation()
  
  const [formData, setFormData] = useState({
    name: "",
    type: "well" as 'well' | 'tap' | 'borehole',
    capacity: "",
    location: "",
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createWaterSource({
        ...formData,
        capacity: Number(formData.capacity),
      }).unwrap()
      navigate('/water-sources')
    } catch (err) {
      console.error('Failed to create water source', err)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Water Source</h1>
        <p className="text-gray-500 text-sm">Register a new water well, reservoir, or intake facility into the system.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Source Name<span className="text-red-500 ml-1">*</span></Label>
            <Input 
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="e.g., Community Well Alpha" 
              className="h-11 rounded-xl" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Type<span className="text-red-500 ml-1">*</span></Label>
            <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({...prev, type: value}))}>
              <SelectTrigger className="h-11 rounded-xl bg-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="well">Groundwater Well</SelectItem>
                <SelectItem value="tap">Water Tap</SelectItem>
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
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({...prev, capacity: e.target.value}))}
              placeholder="10000" 
              className="h-11 rounded-xl" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Location / Coordinates<span className="text-red-500 ml-1">*</span></Label>
            <Input 
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
              placeholder="Sector 4 or GPS coords" 
              className="h-11 rounded-xl" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Description / Notes</Label>
          <Textarea 
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
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
          <Button variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 asChild">
            <Link to="/water-sources">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            {isLoading ? 'Saving...' : 'Save Source'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export function UpdateWaterSourceForm() {
  const { id } = useParams<{id: string}>()
  const navigate = useNavigate()
  const { data: waterSource, isLoading: isFetching } = useGetWaterSourceByIdQuery(id as string, { skip: !id })
  const [updateWaterSource, { isLoading: isUpdating }] = useUpdateWaterSourceMutation()

  const [formData, setFormData] = useState({
    isActive: true,
    condition: "Good" as 'Good' | 'Fair' | 'Poor',
    notes: ""
  })

  useEffect(() => {
    if (waterSource) {
      setFormData({
        isActive: waterSource.isActive ?? true,
        condition: (waterSource.condition as 'Good' | 'Fair' | 'Poor') || "Good",
        notes: waterSource.notes || ""
      })
    }
  }, [waterSource])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      await updateWaterSource({ 
        id, 
        body: formData 
      }).unwrap()
      navigate('/water-sources')
    } catch (err) {
      console.error('Failed to update water source', err)
    }
  }

  if (isFetching) return <div className="p-8 text-center">Loading form details...</div>

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Water Source ({waterSource?.name})</h1>
        <p className="text-gray-500 text-sm">Modify details or change operational status.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Active Status<span className="text-red-500 ml-1">*</span></Label>
            <Select 
              value={formData.isActive ? "active" : "inactive"} 
              onValueChange={(val) => setFormData(prev => ({...prev, isActive: val === "active"}))}
            >
              <SelectTrigger className="h-11 rounded-xl bg-white border-emerald-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Offline / Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Condition<span className="text-red-500 ml-1">*</span></Label>
            <Select 
              value={formData.condition} 
              onValueChange={(val: any) => setFormData(prev => ({...prev, condition: val}))}
            >
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

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Update Notes</Label>
          <Textarea 
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
            placeholder="Provide context for this update..." 
            className="min-h-[100px] rounded-xl resize-y" 
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
          <Button type="button" variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 asChild">
             <Link to="/water-sources">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isUpdating} className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            {isUpdating ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </form>
    </div>
  )
}