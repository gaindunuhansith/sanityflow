import { Fragment, useMemo } from "react"
import { Search, ChevronDown, SlidersHorizontal, Calendar, Download, ChevronRight, ChevronsUpDown, Pencil, Trash2, Plus } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AppDispatch, RootState } from "@/store"
import {
  useGetDriversQuery,
  type Driver,
  type DriverAvailability,
} from "@/features/driver/driverApi"
import {
  setDriverSearchText,
  setAvailabilityFilter,
  clearDriverFilters,
  toggleExpandedDriver,
  setDriverCreateDialogOpen,
  setSelectedDriverIdForEdit,
  setSelectedDriverIdForDelete,
} from "@/features/driver/driverSlice"

const getAvailabilityBadgeClass = (availability: DriverAvailability) => {
  if (availability === "Active") {
    return "bg-[#ebf8ee] text-[#4dbd74]"
  }

  return "bg-slate-100 text-slate-600"
}

const getDriverInitials = (name: string) => {
  const initials = name
    .split(" ")
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return initials || "DR"
}

export function DriverDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    searchText,
    availabilityFilter,
    expandedDriverIds,
  } = useSelector((state: RootState) => state.driver)

  const queryParams = useMemo(() => {
    return {
      ...(availabilityFilter !== "all" ? { availability: availabilityFilter } : {}),
    }
  }, [availabilityFilter])

  const {
    data: drivers = [],
    isLoading: isDriversLoading,
    isError: isDriversError,
    refetch,
  } = useGetDriversQuery(queryParams)

  const filteredDrivers = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    return drivers.filter((driver) => {
      if (normalizedSearch.length === 0) {
        return true
      }

      return (
        driver.name.toLowerCase().includes(normalizedSearch) ||
        driver.email.toLowerCase().includes(normalizedSearch) ||
        driver.contact.toLowerCase().includes(normalizedSearch) ||
        driver.vehicleInfo.toLowerCase().includes(normalizedSearch) ||
        driver.assignedArea.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [drivers, searchText])

  const openCreateDialog = () => {
    dispatch(setDriverCreateDialogOpen(true))
  }

  const openEditDialog = (driverId: string) => {
    dispatch(setSelectedDriverIdForEdit(driverId))
  }

  const openDeleteDialog = (driverId: string) => {
    dispatch(setSelectedDriverIdForDelete(driverId))
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Driver Management</h1>
        <div className="flex items-center gap-3">
          <Button
            className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-4 font-medium"
            onClick={openCreateDialog}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Driver
          </Button>
          <Select defaultValue="this-month">
            <SelectTrigger className="w-32.5 rounded-xl h-10 border-gray-200 bg-white">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-10 w-10 border-gray-200 bg-white"
            onClick={() => void refetch()}
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative w-70">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search driver"
              value={searchText}
              onChange={(event) => dispatch(setDriverSearchText(event.target.value))}
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
            />
          </div>

          <Select
            value={availabilityFilter}
            onValueChange={(value) => dispatch(setAvailabilityFilter(value as "all" | DriverAvailability))}
          >
            <SelectTrigger className="w-42 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Availability</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            className="h-10 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            onClick={() => dispatch(clearDriverFilters())}
          >
            Clear Filters
          </Button>
        </div>

        <div className="flex items-center gap-3 xl:ml-auto w-full xl:w-auto justify-end">
          <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white text-gray-700 font-medium">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            Live View
            <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
          </Button>
          <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-5 font-medium" disabled>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
          Showing {filteredDrivers.length} of {drivers.length} drivers
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <Table className="w-full min-w-[980px] text-left">
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="text-gray-500 font-semibold text-xs w-[34%] py-4 pl-4">Driver</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-44 py-4">Contact</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-44 py-4">Assigned Area</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-28 py-4">
                <div className="flex items-center justify-between">
                  Availability
                  <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />
                </div>
              </TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-44 py-4">Vehicle</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs text-right pr-6 w-24 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isDriversLoading && (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
                  Loading drivers...
                </TableCell>
              </TableRow>
            )}

            {!isDriversLoading && isDriversError && (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="py-10 text-center text-sm text-red-600">
                  Failed to load drivers. Click the filter icon to retry.
                </TableCell>
              </TableRow>
            )}

            {!isDriversLoading && !isDriversError && filteredDrivers.map((driver: Driver) => {
              const isExpanded = expandedDriverIds.includes(driver._id)

              return (
                <Fragment key={driver._id}>
                  <TableRow
                    className={`group transition-colors border-b ${
                      isExpanded
                        ? "bg-emerald-50/40 hover:bg-emerald-50/60 border-emerald-100"
                        : "hover:bg-gray-50/50 border-gray-50"
                    }`}
                  >
                    <TableCell className="pl-4 py-4">
                      <button
                        onClick={() => dispatch(toggleExpandedDriver(driver._id))}
                        className="flex items-center gap-3 text-left w-full focus:outline-none group"
                      >
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            isExpanded ? "rotate-90 text-emerald-600" : "text-gray-400 group-hover:text-emerald-600"
                          }`}
                        />
                        <div className="h-9.5 w-9.5 shrink-0 rounded-full bg-[#c7f7d4] flex items-center justify-center">
                          <span className="text-[12px] font-semibold text-[#0F392B]">{getDriverInitials(driver.name)}</span>
                        </div>
                        <div className="flex flex-col max-w-[320px]">
                          <span className={`font-semibold text-[13px] truncate pr-4 ${isExpanded ? "text-emerald-900" : "text-gray-900"}`}>
                            {driver.name}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-0.5 truncate pr-4">
                            {driver.email}
                          </span>
                        </div>
                      </button>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-700 py-4">{driver.contact}</TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 py-4">{driver.assignedArea}</TableCell>
                    <TableCell className="py-4">
                      <span className={`inline-flex items-center justify-center px-3 tracking-wide py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${getAvailabilityBadgeClass(driver.availability)}`}>
                        {driver.availability}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 py-4">{driver.vehicleInfo}</TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          title="Edit Driver (Step 7)"
                          onClick={() => openEditDialog(driver._id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete Driver (Step 8)"
                          onClick={() => openDeleteDialog(driver._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow className="bg-emerald-50/5 border-b border-gray-100 hover:bg-emerald-50/5">
                      <TableCell colSpan={6} className="p-0">
                        <div className="bg-emerald-50/20 border-t border-emerald-100/50 px-8 py-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Driver ID</p>
                              <p className="text-sm font-medium text-gray-800">{driver._id}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">User ID</p>
                              <p className="text-sm font-medium text-gray-800">{driver.userId}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Created</p>
                              <p className="text-sm font-medium text-gray-800">{new Date(driver.createdAt).toLocaleDateString("en-US")}</p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })}

            {!isDriversLoading && !isDriversError && filteredDrivers.length === 0 && (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
                  <p className="text-sm font-medium text-gray-700 mb-1">No drivers match your current filters.</p>
                  <p className="text-xs text-gray-500">Try clearing filters or changing the search keyword.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
