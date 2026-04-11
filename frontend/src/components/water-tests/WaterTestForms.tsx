import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldAlert, Cloud, Thermometer, Droplets, Wind } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  useCreateWaterTestMutation,
  useGetWaterTestByIdQuery,
  useUpdateWaterTestMutation,
} from "@/features/water-tests/waterTestApi"
import { useGetWaterSourcesQuery } from "@/features/water-sources/waterSourceApi"

const parseContaminants = (raw: string) =>
  raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item && item !== 'none' && item !== 'n/a' && item !== 'na' && item !== 'nil' && item !== 'null' && item !== '-')

const getSourceId = (value: unknown) => {
  if (typeof value === "string") return value
  if (value && typeof value === "object" && "_id" in value) {
    return String((value as { _id: string })._id)
  }
  return ""
}

export function CreateWaterTestForm() {
  const navigate = useNavigate()
  const { data: sources, isLoading: isLoadingSources } = useGetWaterSourcesQuery()
  const [createWaterTest, { isLoading }] = useCreateWaterTestMutation()
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState({
    waterSource: "",
    pH: "",
    tds: "",
    turbidity: "",
    contaminants: "",
    notes: "",
  })

  const canSubmit = useMemo(() => {
    return Boolean(
      formData.waterSource &&
        formData.pH !== "" &&
        formData.tds !== "" &&
        formData.turbidity !== ""
    )
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!canSubmit) {
      setErrorMessage("Please complete all required fields.")
      return
    }

    try {
      await createWaterTest({
        waterSource: formData.waterSource,
        pH: Number(formData.pH),
        tds: Number(formData.tds),
        turbidity: Number(formData.turbidity),
        contaminants: parseContaminants(formData.contaminants),
        notes: formData.notes || undefined,
      }).unwrap()

      navigate("/dashboard/water-tests")
    } catch (err) {
      console.error("Failed to create water test", err)
      setErrorMessage("Failed to create water test. Check your inputs and try again.")
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Log New Water Test</h1>
        <p className="text-gray-500 text-sm">Enter field or lab metrics for water quality compliance checks.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Target Water Source<span className="text-red-500 ml-1">*</span></Label>
          <Select
            value={formData.waterSource}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, waterSource: value }))}
            disabled={isLoadingSources}
          >
            <SelectTrigger className="h-11 rounded-xl bg-white">
              <SelectValue placeholder={isLoadingSources ? "Loading sources..." : "Select Source"} />
            </SelectTrigger>
            <SelectContent>
              {sources?.map((source) => (
                <SelectItem key={source._id} value={source._id}>
                  {source.name} - {source.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">pH Level<span className="text-red-500 ml-1">*</span></Label>
            <Input
              required
              type="number"
              step="0.1"
              value={formData.pH}
              onChange={(event) => setFormData((prev) => ({ ...prev, pH: event.target.value }))}
              placeholder="7.0"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">TDS (ppm)<span className="text-red-500 ml-1">*</span></Label>
            <Input
              required
              type="number"
              step="1"
              min="0"
              value={formData.tds}
              onChange={(event) => setFormData((prev) => ({ ...prev, tds: event.target.value }))}
              placeholder="150"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Turbidity (NTU)<span className="text-red-500 ml-1">*</span></Label>
            <Input
              required
              type="number"
              step="0.1"
              min="0"
              value={formData.turbidity}
              onChange={(event) => setFormData((prev) => ({ ...prev, turbidity: event.target.value }))}
              placeholder="0.5"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Contaminants (comma-separated)</Label>
          <Input
            value={formData.contaminants}
            onChange={(event) => setFormData((prev) => ({ ...prev, contaminants: event.target.value }))}
            placeholder="e.g., lead, arsenic"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Test Remarks / Observations</Label>
          <Textarea
            value={formData.notes}
            onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
            placeholder="Any visual observations or lab notes..."
            className="min-h-[100px] rounded-xl resize-y"
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Safety Classification</p>
            <p>Status is calculated automatically from pH, TDS, turbidity, and contaminants.</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Cloud className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Weather Data Integration</p>
            <p>Temperature, humidity, pressure, and wind conditions will be automatically captured from the water source location for scientific correlation.</p>
          </div>
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
          <Button variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 asChild">
            <Link to="/dashboard/water-tests">Cancel</Link>
          </Button>
          <Button
            disabled={isLoading || !canSubmit}
            className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm"
            type="submit"
          >
            {isLoading ? "Saving..." : "Save Test Data"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export function UpdateWaterTestForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: test, isLoading: isFetching } = useGetWaterTestByIdQuery(id ?? "", { skip: !id })
  const [updateWaterTest, { isLoading: isUpdating }] = useUpdateWaterTestMutation()
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState({
    pH: "",
    tds: "",
    turbidity: "",
    contaminants: "",
    notes: "",
  })

  useEffect(() => {
    if (!test) return
    setFormData({
      pH: String(test.pH ?? ""),
      tds: String(test.tds ?? ""),
      turbidity: String(test.turbidity ?? ""),
      contaminants: (test.contaminants ?? []).join(", "),
      notes: test.notes ?? "",
    })
  }, [test])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!id) {
      setErrorMessage("Missing water test ID.")
      return
    }

    try {
      await updateWaterTest({
        id,
        body: {
          pH: Number(formData.pH),
          tds: Number(formData.tds),
          turbidity: Number(formData.turbidity),
          contaminants: parseContaminants(formData.contaminants),
          notes: formData.notes || undefined,
        },
      }).unwrap()

      navigate("/dashboard/water-tests")
    } catch (err) {
      console.error("Failed to update water test", err)
      setErrorMessage("Failed to update water test. Please try again.")
    }
  }

  if (isFetching) return <div>Loading...</div>
  if (!test) return <div>Water test not found</div>

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Test Record</h1>
        <p className="text-gray-500 text-sm">Modify test metrics for this water quality record.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Target Water Source</Label>
          <Input value={getSourceId(test.waterSource)} disabled className="h-11 rounded-xl bg-gray-50" />
        </div>

        {test.temperature !== undefined && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Weather Conditions at Time of Test
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="h-3 w-3 text-blue-600" />
                <span className="text-blue-800">{test.temperature.toFixed(1)}°C</span>
              </div>
              {test.weatherCondition && (
                <div className="flex items-center gap-2">
                  <Cloud className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-800 capitalize">{test.weatherCondition}</span>
                </div>
              )}
              {test.humidity !== undefined && (
                <div className="flex items-center gap-2">
                  <Droplets className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-800">{test.humidity}% humidity</span>
                </div>
              )}
              {test.windSpeed !== undefined && (
                <div className="flex items-center gap-2">
                  <Wind className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-800">{test.windSpeed.toFixed(1)} m/s</span>
                </div>
              )}
            </div>
            {test.weatherDescription && (
              <p className="text-xs text-blue-700 mt-3 italic">{test.weatherDescription}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">pH Level<span className="text-red-500 ml-1">*</span></Label>
            <Input
              required
              type="number"
              step="0.1"
              value={formData.pH}
              onChange={(event) => setFormData((prev) => ({ ...prev, pH: event.target.value }))}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">TDS (ppm)<span className="text-red-500 ml-1">*</span></Label>
            <Input
              required
              type="number"
              step="1"
              min="0"
              value={formData.tds}
              onChange={(event) => setFormData((prev) => ({ ...prev, tds: event.target.value }))}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Turbidity (NTU)<span className="text-red-500 ml-1">*</span></Label>
            <Input
              required
              type="number"
              step="0.1"
              min="0"
              value={formData.turbidity}
              onChange={(event) => setFormData((prev) => ({ ...prev, turbidity: event.target.value }))}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Contaminants (comma-separated)</Label>
          <Input
            value={formData.contaminants}
            onChange={(event) => setFormData((prev) => ({ ...prev, contaminants: event.target.value }))}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Update Remarks</Label>
          <Textarea
            value={formData.notes}
            onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
            className="min-h-[100px] rounded-xl resize-y"
          />
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
          <Button variant="ghost" className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 asChild">
            <Link to="/dashboard/water-tests">Cancel</Link>
          </Button>
          <Button
            disabled={isUpdating}
            type="submit"
            className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm"
          >
            {isUpdating ? "Updating..." : "Publish Final Report"}
          </Button>
        </div>
      </form>
    </div>
  )
}
