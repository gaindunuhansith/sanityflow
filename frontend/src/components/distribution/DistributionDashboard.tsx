import { Fragment, useState } from "react"
import { Search, ChevronDown, SlidersHorizontal, Calendar, Download, ChevronRight, ChevronsUpDown, Truck, UserPlus, RefreshCw, Trash2 } from "lucide-react"

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

type OrderStatus = "Pending" | "Assigned" | "In Transit" | "Delivered" | "Failed"

type OrderTimelineItem = {
  id: string
  message: string
  actor: string
  createdAt: string
}

type DistributionOrder = {
  id: string
  orderNumber: string
  resourceName: string
  quantity: number
  targetLocation: string
  status: OrderStatus
  driverName: string
  createdBy: string
  createdAt: string
  notes: string
  timeline: OrderTimelineItem[]
}

const MOCK_ORDERS: DistributionOrder[] = [
  {
    id: "64a7d2a34a2e5d9c12345681",
    orderNumber: "SF-ORD-001",
    resourceName: "Clean Water Drums",
    quantity: 120,
    targetLocation: "Sector 4 - East",
    status: "Pending",
    driverName: "Unassigned",
    createdBy: "Admin Operations",
    createdAt: "2028-09-25T10:00:00",
    notes: "Priority supply due to temporary pressure drop in main line.",
    timeline: [
      {
        id: "t1",
        message: "Order created and pending assignment.",
        actor: "Admin Operations",
        createdAt: "2028-09-25T10:00:00",
      },
    ],
  },
  {
    id: "64a7d2a34a2e5d9c12345682",
    orderNumber: "SF-ORD-002",
    resourceName: "Emergency Water Kits",
    quantity: 40,
    targetLocation: "Hilltop Community Center",
    status: "Assigned",
    driverName: "Dianne Russell",
    createdBy: "Logistics Manager",
    createdAt: "2028-09-24T09:20:00",
    notes: "Coordinate with local team for controlled handover.",
    timeline: [
      {
        id: "t2",
        message: "Order created.",
        actor: "Logistics Manager",
        createdAt: "2028-09-24T09:20:00",
      },
      {
        id: "t3",
        message: "Driver assigned to route.",
        actor: "Dispatch Lead",
        createdAt: "2028-09-24T10:05:00",
      },
    ],
  },
  {
    id: "64a7d2a34a2e5d9c12345683",
    orderNumber: "SF-ORD-003",
    resourceName: "Water Purification Tablets",
    quantity: 260,
    targetLocation: "Sector 2 - South",
    status: "In Transit",
    driverName: "Jacob Jones",
    createdBy: "Admin Operations",
    createdAt: "2028-09-24T07:45:00",
    notes: "Driver to confirm arrival with site supervisor.",
    timeline: [
      {
        id: "t4",
        message: "Order created.",
        actor: "Admin Operations",
        createdAt: "2028-09-24T07:45:00",
      },
      {
        id: "t5",
        message: "Driver assigned.",
        actor: "Dispatch Lead",
        createdAt: "2028-09-24T08:10:00",
      },
      {
        id: "t6",
        message: "Vehicle departed from warehouse.",
        actor: "Jacob Jones",
        createdAt: "2028-09-24T08:35:00",
      },
    ],
  },
  {
    id: "64a7d2a34a2e5d9c12345684",
    orderNumber: "SF-ORD-004",
    resourceName: "Medical Hygiene Packs",
    quantity: 90,
    targetLocation: "West Relief Point",
    status: "Delivered",
    driverName: "Guy Hawkins",
    createdBy: "Relief Coordinator",
    createdAt: "2028-09-23T12:30:00",
    notes: "Successful delivery confirmed by local coordinator.",
    timeline: [
      {
        id: "t7",
        message: "Order created.",
        actor: "Relief Coordinator",
        createdAt: "2028-09-23T12:30:00",
      },
      {
        id: "t8",
        message: "Driver assigned.",
        actor: "Dispatch Lead",
        createdAt: "2028-09-23T12:55:00",
      },
      {
        id: "t9",
        message: "Delivery marked as completed.",
        actor: "Guy Hawkins",
        createdAt: "2028-09-23T14:05:00",
      },
    ],
  },
  {
    id: "64a7d2a34a2e5d9c12345685",
    orderNumber: "SF-ORD-005",
    resourceName: "Portable Storage Tanks",
    quantity: 8,
    targetLocation: "North Ridge",
    status: "Failed",
    driverName: "Cameron Williamson",
    createdBy: "Logistics Manager",
    createdAt: "2028-09-22T16:15:00",
    notes: "Route blocked due to landslide, awaiting reassignment.",
    timeline: [
      {
        id: "t10",
        message: "Order created.",
        actor: "Logistics Manager",
        createdAt: "2028-09-22T16:15:00",
      },
      {
        id: "t11",
        message: "Delivery attempt failed due to road closure.",
        actor: "Cameron Williamson",
        createdAt: "2028-09-22T18:10:00",
      },
    ],
  },
]

const getStatusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case "Pending":
      return "bg-red-50 text-red-500"
    case "Assigned":
      return "bg-blue-50 text-blue-600"
    case "In Transit":
      return "bg-amber-50 text-amber-600"
    case "Delivered":
      return "bg-[#ebf8ee] text-[#4dbd74]"
    case "Failed":
      return "bg-rose-50 text-rose-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

export function DistributionDashboard() {
  const [orders, setOrders] = useState<DistributionOrder[]>(MOCK_ORDERS)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all")
  const [driverFilter, setDriverFilter] = useState("all")

  const availableDrivers = Array.from(new Set(orders.map((order) => order.driverName))).sort()

  const filteredOrders = orders.filter((order) => {
    const normalizedSearch = searchText.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch.length === 0 ||
      order.orderNumber.toLowerCase().includes(normalizedSearch) ||
      order.resourceName.toLowerCase().includes(normalizedSearch) ||
      order.targetLocation.toLowerCase().includes(normalizedSearch)

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesDriver = driverFilter === "all" || order.driverName === driverFilter

    return matchesSearch && matchesStatus && matchesDriver
  })

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const cycleStatus = (status: OrderStatus): OrderStatus => {
    switch (status) {
      case "Pending":
        return "Assigned"
      case "Assigned":
        return "In Transit"
      case "In Transit":
        return "Delivered"
      case "Delivered":
        return "Failed"
      case "Failed":
        return "Pending"
      default:
        return "Pending"
    }
  }

  const handleAssignToggle = (id: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== id) return order

        const nextDriver = order.driverName === "Unassigned" ? "Dianne Russell" : "Unassigned"
        const nextStatus = nextDriver === "Unassigned" ? "Pending" : order.status === "Pending" ? "Assigned" : order.status

        return {
          ...order,
          driverName: nextDriver,
          status: nextStatus,
        }
      })
    )
  }

  const handleStatusCycle = (id: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: cycleStatus(order.status) } : order))
    )
  }

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id))
    setExpandedOrders((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Distribution Orders</h1>
        <div className="flex items-center gap-3">
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
          <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-gray-200 bg-white">
            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-70">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search order"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | OrderStatus)}>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Transit">In Transit</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={driverFilter} onValueChange={setDriverFilter}>
            <SelectTrigger className="w-35 h-10 rounded-xl border-gray-200 bg-white">
              <SelectValue placeholder="All Drivers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers</SelectItem>
              {availableDrivers.map((driver) => (
                <SelectItem key={driver} value={driver}>
                  {driver}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white text-gray-700 font-medium">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            1-30 September 2028
            <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
          </Button>
          <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-5 font-medium">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <Table className="w-full text-left">
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="text-gray-500 font-semibold text-xs w-[38%] py-4 pl-4">Order</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-24 py-4">Quantity</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-44 py-4">Target Location</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-28 py-4">
                <div className="flex items-center justify-between">
                  Status
                  <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />
                </div>
              </TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs w-32 py-4">Driver</TableHead>
              <TableHead className="text-gray-500 font-semibold text-xs text-right pr-6 w-24 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrders.has(order.id)
              const createdAt = new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })

              return (
                <Fragment key={order.id}>
                  <TableRow
                    className={`group transition-colors border-b ${
                      isExpanded
                        ? "bg-emerald-50/40 hover:bg-emerald-50/60 border-emerald-100"
                        : "hover:bg-gray-50/50 border-gray-50"
                    }`}
                  >
                    <TableCell className="pl-4 py-4">
                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="flex items-center gap-3 text-left w-full focus:outline-none group"
                      >
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            isExpanded ? "rotate-90 text-emerald-600" : "text-gray-400 group-hover:text-emerald-600"
                          }`}
                        />
                        <div className="h-9.5 w-9.5 shrink-0 rounded-full bg-[#c7f7d4] flex items-center justify-center">
                          <Truck className="h-4.5 w-4.5 text-[#0F392B]" />
                        </div>
                        <div className="flex flex-col max-w-[320px]">
                          <span className={`font-semibold text-[13px] truncate pr-4 ${isExpanded ? "text-emerald-900" : "text-gray-900"}`}>
                            {order.orderNumber}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-0.5 truncate pr-4">
                            {order.resourceName} • {createdAt}
                          </span>
                        </div>
                      </button>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-700 py-4">{order.quantity}</TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 py-4">{order.targetLocation}</TableCell>
                    <TableCell className="py-4">
                      <span className={`inline-flex items-center justify-center px-3 tracking-wide py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 py-4">{order.driverName}</TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                          onClick={() => handleAssignToggle(order.id)}
                          title="Assign/Unassign Driver"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => handleStatusCycle(order.id)}
                          title="Cycle Status"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteOrder(order.id)}
                          title="Delete Order"
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
                              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Created By</p>
                              <p className="text-sm font-medium text-gray-800">{order.createdBy}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Driver</p>
                              <p className="text-sm font-medium text-gray-800">{order.driverName}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Order ID</p>
                              <p className="text-sm font-medium text-gray-800">{order.id}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Notes</p>
                            <p className="text-sm text-gray-700">{order.notes}</p>
                          </div>

                          <div className="rounded-xl border border-emerald-100/70 bg-white/80 overflow-hidden">
                            <Table className="w-full text-left">
                              <TableHeader>
                                <TableRow className="border-b border-emerald-100/50 hover:bg-transparent">
                                  <TableHead className="text-gray-500 font-semibold text-xs py-2 pl-4 w-[55%]">Timeline Event</TableHead>
                                  <TableHead className="text-gray-500 font-semibold text-xs py-2 w-[20%]">By</TableHead>
                                  <TableHead className="text-gray-500 font-semibold text-xs py-2 w-[25%]">Time</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.timeline.map((item) => {
                                  const itemDate = new Date(item.createdAt)
                                  const dateLabel = itemDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                  const timeLabel = itemDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })

                                  return (
                                    <TableRow key={item.id} className="hover:bg-emerald-50/40 border-b border-emerald-50/50">
                                      <TableCell className="py-3 pl-4 text-sm text-gray-700">{item.message}</TableCell>
                                      <TableCell className="py-3 text-sm font-medium text-gray-800">{item.actor}</TableCell>
                                      <TableCell className="py-3">
                                        <div className="text-sm text-gray-600">{dateLabel}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{timeLabel}</div>
                                      </TableCell>
                                    </TableRow>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })}
            {filteredOrders.length === 0 && (
              <TableRow className="border-b border-gray-50">
                <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
                  No orders match your current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
