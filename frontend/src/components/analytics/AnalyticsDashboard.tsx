import { useState } from "react"
import { Calendar, TrendingUp, BarChart3, Cloud, Thermometer, Droplets, Wind, ShieldCheck, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetWaterTestAnalyticsQuery } from "@/features/water-tests/waterTestApi"
import { useGetWaterSourcesQuery } from "@/features/water-sources/waterSourceApi"

interface AnalyticsData {
  _id: { waterSource: string; year: number; month: number; day: number }
  avgPH: number
  avgTDS: number
  avgTurbidity: number
  avgTemperature?: number
  avgHumidity?: number
  avgPressure?: number
  avgWindSpeed?: number
  totalTests: number
  testsWithWeatherData: number
  unsafeCount: number
  safeCount: number
}

export function AnalyticsDashboard() {
  const [selectedSource, setSelectedSource] = useState<string>("")
  const { data: sources = [] } = useGetWaterSourcesQuery()
  const { data: analytics = [], isLoading } = useGetWaterTestAnalyticsQuery(
    selectedSource ? { source: selectedSource } : undefined
  )

  const formatDate = (data: AnalyticsData['_id']) => {
    return new Date(data.year, data.month - 1, data.day).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getSourceName = (sourceId: string) => {
    const source = sources.find(s => s._id === sourceId)
    return source?.name || sourceId
  }

  // Calculate overall statistics
  const totalTests = analytics.reduce((sum, item) => sum + item.totalTests, 0)
  const totalUnsafe = analytics.reduce((sum, item) => sum + item.unsafeCount, 0)
  const totalSafe = analytics.reduce((sum, item) => sum + item.safeCount, 0)
  const avgPH = analytics.length > 0 ? analytics.reduce((sum, item) => sum + item.avgPH, 0) / analytics.length : 0

  // Weather statistics
  const testsWithWeather = analytics.reduce((sum, item) => sum + item.testsWithWeatherData, 0)
  const weatherCoverage = totalTests > 0 ? (testsWithWeather / totalTests) * 100 : 0
  const avgTemperature = analytics.length > 0
    ? analytics.filter(item => item.avgTemperature !== undefined).reduce((sum, item) => sum + (item.avgTemperature || 0), 0) /
      analytics.filter(item => item.avgTemperature !== undefined).length
    : undefined

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Water Quality Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive analysis of water quality trends and weather correlations</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All water sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All water sources</SelectItem>
              {sources.map((source) => (
                <SelectItem key={source._id} value={source._id}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">
              {totalSafe} safe, {totalUnsafe} unsafe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average pH</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPH.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Target range: 6.5-8.5
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weather Coverage</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherCoverage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {testsWithWeather} of {totalTests} tests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgTemperature !== undefined ? `${avgTemperature.toFixed(1)}°C` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Weather correlation data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weather Correlation Analysis */}
      {weatherCoverage > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Weather-Water Quality Correlation
            </CardTitle>
            <CardDescription>
              Analysis of how weather conditions correlate with water quality parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Thermometer className="h-4 w-4 text-blue-600" />
                  Temperature Impact
                </div>
                <p className="text-sm text-gray-600">
                  Higher temperatures may affect microbial growth and chemical reactions in water sources.
                  Current average: {avgTemperature?.toFixed(1) || 'N/A'}°C
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  Humidity Effects
                </div>
                <p className="text-sm text-gray-600">
                  High humidity can increase evaporation and concentration of contaminants.
                  Monitor during humid periods for potential quality changes.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wind className="h-4 w-4 text-blue-600" />
                  Wind & Contamination
                </div>
                <p className="text-sm text-gray-600">
                  Wind can carry airborne contaminants and affect water surface mixing.
                  Consider wind conditions in contamination risk assessments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Detailed Trends
          </CardTitle>
          <CardDescription>
            Daily water quality metrics and weather correlations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No analytics data available. Start logging water quality tests to see trends.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Source</th>
                    <th className="text-center py-3 px-4 font-medium">Tests</th>
                    <th className="text-center py-3 px-4 font-medium">Avg pH</th>
                    <th className="text-center py-3 px-4 font-medium">Avg TDS</th>
                    <th className="text-center py-3 px-4 font-medium">Avg Turbidity</th>
                    <th className="text-center py-3 px-4 font-medium">Weather</th>
                    <th className="text-center py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(item._id)}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {getSourceName(item._id.waterSource)}
                      </td>
                      <td className="py-3 px-4 text-center">{item.totalTests}</td>
                      <td className="py-3 px-4 text-center">{item.avgPH ? item.avgPH.toFixed(2) : 'N/A'}</td>
                      <td className="py-3 px-4 text-center">{item.avgTDS ? `${item.avgTDS.toFixed(0)} ppm` : 'N/A'}</td>
                      <td className="py-3 px-4 text-center">{item.avgTurbidity ? `${item.avgTurbidity.toFixed(2)} NTU` : 'N/A'}</td>
                      <td className="py-3 px-4 text-center">
                        {item.avgTemperature !== undefined ? (
                          <div className="flex items-center justify-center gap-1">
                            <Thermometer className="h-3 w-3 text-blue-600" />
                            <span className="text-xs">{item.avgTemperature.toFixed(1)}°C</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-green-600" />
                            <span className="text-xs">{item.safeCount}</span>
                          </div>
                          {item.unsafeCount > 0 && (
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                              <span className="text-xs">{item.unsafeCount}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}