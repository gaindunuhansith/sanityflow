import { useMemo, useState } from 'react'
import { CloudRain, Search, Thermometer, Droplets, TriangleAlert, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetWaterSourcesQuery } from '@/features/water-sources/waterSourceApi'
import { useLazyGetWeatherByLocationQuery } from '@/features/weather/weatherApi'

export function WeatherDashboard() {
  const { data: sources } = useGetWaterSourcesQuery()
  const [location, setLocation] = useState('')
  const [selectedSourceId, setSelectedSourceId] = useState('')
  const [fetchWeather, weatherQuery] = useLazyGetWeatherByLocationQuery()

  const selectedSource = useMemo(() => {
    return sources?.find((source) => source._id === selectedSourceId)
  }, [selectedSourceId, sources])

  const activeLocation = selectedSource?.location ?? location.trim()

  const handleSearch = async () => {
    if (!activeLocation) return
    await fetchWeather(activeLocation)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Weather Risk Monitor</h1>
        <p className="text-sm text-gray-500 mt-1">Check live weather by location or from any registered water source.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">From Water Source</label>
          <select
            className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm"
            value={selectedSourceId}
            onChange={(event) => {
              setSelectedSourceId(event.target.value)
              setLocation('')
            }}
          >
            <option value="">Select source</option>
            {sources?.map((source) => (
              <option key={source._id} value={source._id}>
                {source.name} - {source.location}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Or Enter Location</label>
          <div className="flex items-center gap-2">
            <Input
              value={location}
              onChange={(event) => {
                setLocation(event.target.value)
                setSelectedSourceId('')
              }}
              placeholder="e.g., Nairobi"
              className="h-11 rounded-xl"
            />
            <Button type="button" onClick={handleSearch} className="h-11 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {weatherQuery.isFetching && <p className="text-sm text-gray-500">Fetching weather data...</p>}
      {weatherQuery.isError && (
        <p className="text-sm text-red-600">Failed to fetch weather data. Verify location and try again.</p>
      )}

      {weatherQuery.data && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/50">
            <p className="text-xs uppercase text-gray-500 font-semibold">Condition</p>
            <div className="mt-2 flex items-center gap-2 text-gray-900 font-semibold">
              <CloudRain className="h-4 w-4 text-sky-600" />
              <span>{weatherQuery.data.condition}</span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/50">
            <p className="text-xs uppercase text-gray-500 font-semibold">Temperature</p>
            <div className="mt-2 flex items-center gap-2 text-gray-900 font-semibold">
              <Thermometer className="h-4 w-4 text-rose-600" />
              <span>{weatherQuery.data.temp_c.toFixed(1)} C</span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/50">
            <p className="text-xs uppercase text-gray-500 font-semibold">Humidity</p>
            <div className="mt-2 flex items-center gap-2 text-gray-900 font-semibold">
              <Droplets className="h-4 w-4 text-blue-600" />
              <span>{weatherQuery.data.humidity}%</span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/50">
            <p className="text-xs uppercase text-gray-500 font-semibold">Rainfall (1h)</p>
            <div className="mt-2 flex items-center gap-2 text-gray-900 font-semibold">
              <CloudRain className="h-4 w-4 text-indigo-600" />
              <span>{weatherQuery.data.rainfall_last_1h_mm} mm</span>
            </div>
          </div>
        </div>
      )}

      {weatherQuery.data && (
        <div
          className={`rounded-xl border p-4 ${
            weatherQuery.data.isHighRisk ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'
          }`}
        >
          <div className="flex items-start gap-3">
            {weatherQuery.data.isHighRisk ? (
              <TriangleAlert className="h-5 w-5 text-red-600 mt-0.5" />
            ) : (
              <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
            )}
            <div>
              <p className={`font-semibold ${weatherQuery.data.isHighRisk ? 'text-red-700' : 'text-emerald-700'}`}>
                {weatherQuery.data.isHighRisk ? 'High weather risk detected' : 'No high weather risk detected'}
              </p>
              <p className={`text-sm mt-1 ${weatherQuery.data.isHighRisk ? 'text-red-700' : 'text-emerald-700'}`}>
                {weatherQuery.data.riskReason ?? 'Current conditions are stable for water operations.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
