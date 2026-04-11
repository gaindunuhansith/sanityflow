import { useEffect, useMemo, useState } from "react"
import { PackagePlus, RefreshCw, Search, SlidersHorizontal } from "lucide-react"
import {
  useGetTransactionsQuery,
  type InventoryTransactionType,
} from "@/features/inventory/inventoryTransactionApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import {
  selectTransactionState,
  resetTransactionFilters,
  setCreateTransactionModalOpen,
  setTransactionPage,
  setTransactionSearchQuery,
  setTransactionTypeFilter,
} from "@/features/inventory/inventoryTransactionSlice"
import { InventoryTransactionForm } from "@/components/inventory/InventoryTransactionForm"

const LARGE_FETCH_LIMIT = 1000

const transactionTypes: InventoryTransactionType[] = ["ADD", "REMOVE", "TRANSFER"]

const getTransactionTypeColor = (type: InventoryTransactionType) => {
  switch (type) {
    case "ADD":
      return "bg-[#ebf8ee] text-[#4dbd74]"
    case "REMOVE":
      return "bg-red-50 text-red-500"
    case "TRANSFER":
      return "bg-amber-50 text-amber-600"
    default:
      return "bg-slate-100 text-slate-600"
  }
}

const getProductLabel = (product: unknown) => {
  if (typeof product === "string") {
    return product
  }

  if (product && typeof product === "object" && "name" in product) {
    const name = (product as { name?: string }).name
    if (name) {
      return name
    }
  }

  if (product && typeof product === "object" && "_id" in product) {
    const id = (product as { _id?: string })._id
    if (id) {
      return id
    }
  }

  return "Unknown product"
}

const getUserLabel = (user: unknown) => {
  if (typeof user === "string") {
    return user
  }

  if (user && typeof user === "object" && "name" in user) {
    const name = (user as { name?: string }).name
    if (name) {
      return name
    }
  }

  if (user && typeof user === "object" && "_id" in user) {
    const id = (user as { _id?: string })._id
    if (id) {
      return id
    }
  }

  return "Unknown user"
}

export function InventoryTransactionDashboard() {
  const dispatch = useAppDispatch()
  const { searchQuery, typeFilter, page, limit, isCreateModalOpen } =
    useAppSelector(selectTransactionState)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [actorFilter, setActorFilter] = useState("")

  const { data: response, isLoading, refetch } = useGetTransactionsQuery({
    page: 1,
    limit: LARGE_FETCH_LIMIT,
  })

  const transactions = response?.items ?? []

  const filteredTransactions = useMemo(() => {
    const search = searchQuery.trim().toLowerCase()
    const actor = actorFilter.trim().toLowerCase()

    return transactions.filter((transaction) => {
      if (typeFilter !== "all" && transaction.type !== typeFilter) {
        return false
      }

      const transactionDate = new Date(transaction.date).toISOString().slice(0, 10)

      if (fromDate && transactionDate < fromDate) {
        return false
      }

      if (toDate && transactionDate > toDate) {
        return false
      }

      const user = getUserLabel(transaction.user)

      if (actor && !user.toLowerCase().includes(actor)) {
        return false
      }

      if (!search) {
        return true
      }

      const product = getProductLabel(transaction.product)
      const reason = transaction.reason ?? ""

      return [product, reason, user, transaction.type].some((field) =>
        field.toLowerCase().includes(search),
      )
    })
  }, [transactions, searchQuery, typeFilter, fromDate, toDate, actorFilter])

  const totalTransactions = filteredTransactions.length
  const totalPages = Math.max(1, Math.ceil(totalTransactions / limit))

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * limit
    return filteredTransactions.slice(start, start + limit)
  }, [filteredTransactions, page, limit])

  const transactionRows = (() => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center text-gray-500 py-8">
            Loading transactions...
          </TableCell>
        </TableRow>
      )
    }

    if (paginatedTransactions.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center text-gray-500 py-8">
            No transactions found.
          </TableCell>
        </TableRow>
      )
    }

    return paginatedTransactions.map((transaction) => (
      <TableRow key={transaction._id}>
        <TableCell className="font-medium">{getProductLabel(transaction.product)}</TableCell>
        <TableCell>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${getTransactionTypeColor(transaction.type)}`}>
            {transaction.type}
          </span>
        </TableCell>
        <TableCell>
          <span className="font-medium">{transaction.quantity}</span>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{transaction.reason}</TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {new Date(transaction.date).toLocaleDateString()}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{getUserLabel(transaction.user)}</TableCell>
      </TableRow>
    ))
  })()

  useEffect(() => {
    if (page > totalPages) {
      dispatch(setTransactionPage(totalPages))
    }
  }, [dispatch, page, totalPages])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventory Transactions</h1>
          <p className="text-sm text-gray-500">Track stock additions, removals, and transfers.</p>
        </div>
        <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white" onClick={() => void refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-4">
        <p className="text-sm text-gray-500">Total Transactions</p>
        <p className="text-2xl font-semibold text-gray-900">{totalTransactions}</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions"
                className="pl-9 h-10 rounded-xl bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-green-500"
                value={searchQuery}
                onChange={(event) => dispatch(setTransactionSearchQuery(event.target.value))}
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(value) => dispatch(setTransactionTypeFilter(value as "all" | InventoryTransactionType))}
            >
              <SelectTrigger className="w-44 h-10 rounded-xl border-gray-200 bg-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {transactionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              className="h-10 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              onClick={() => {
                dispatch(resetTransactionFilters())
                setFromDate("")
                setToDate("")
                setActorFilter("")
              }}
            >
              Clear Filters
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-10 w-10 border-gray-200 bg-white"
              onClick={() => setShowAdvancedFilters((current) => !current)}
            >
              <SlidersHorizontal className="h-4 w-4 text-gray-600" />
            </Button>
            <Button className="h-10 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white px-4 font-medium" onClick={() => dispatch(setCreateTransactionModalOpen(true))}>
              <PackagePlus className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </div>
        </div>

        {showAdvancedFilters ? (
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">From</p>
              <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="h-10 w-44 rounded-xl border-gray-200 bg-white" />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">To</p>
              <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="h-10 w-44 rounded-xl border-gray-200 bg-white" />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">User</p>
              <Input
                placeholder="Filter by user"
                value={actorFilter}
                onChange={(event) => setActorFilter(event.target.value)}
                className="h-10 w-52 rounded-xl border-gray-200 bg-white"
              />
            </div>

            <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white self-end" onClick={() => void refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        ) : null}

        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionRows}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>
            Showing {paginatedTransactions.length} of {totalTransactions} transactions
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => dispatch(setTransactionPage(page - 1))}>
              Previous
            </Button>
            <span>Page {page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => dispatch(setTransactionPage(page + 1))}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <InventoryTransactionForm
        isOpen={isCreateModalOpen}
        onClose={() => dispatch(setCreateTransactionModalOpen(false))}
      />
    </div>
  )
}
