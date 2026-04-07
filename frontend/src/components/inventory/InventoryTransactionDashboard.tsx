import { useMemo } from "react"
import { Search, Plus } from "lucide-react"
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
  setTransactionSearchQuery,
  setTransactionTypeFilter,
  setCreateTransactionModalOpen,
} from "@/features/inventory/inventoryTransactionSlice"
import { InventoryTransactionForm } from "@/components/inventory/InventoryTransactionForm"

const transactionTypes: InventoryTransactionType[] = ["ADD", "REMOVE", "TRANSFER"]

const getTransactionTypeColor = (type: InventoryTransactionType) => {
  switch (type) {
    case "ADD":
      return "bg-green-100 text-green-800"
    case "REMOVE":
      return "bg-red-100 text-red-800"
    case "TRANSFER":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getProductLabel = (product: unknown) => {
  if (typeof product === "string") {
    return `${product.slice(0, 8)}...`
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
      return `${id.slice(0, 8)}...`
    }
  }

  return "Unknown product"
}

const getUserLabel = (user: unknown) => {
  if (typeof user === "string") {
    return `${user.slice(0, 8)}...`
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
      return `${id.slice(0, 8)}...`
    }
  }

  return "Unknown user"
}

export function InventoryTransactionDashboard() {
  const dispatch = useAppDispatch()
  const { searchQuery, typeFilter, page, limit, isCreateModalOpen } =
    useAppSelector(selectTransactionState)

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(typeFilter !== "all" ? { type: typeFilter } : {}),
      ...(searchQuery.trim().length > 0 ? { search: searchQuery.trim() } : {}),
    }),
    [limit, page, searchQuery, typeFilter],
  )

  const { data: response, isLoading } = useGetTransactionsQuery(queryParams)
  const transactions = response?.items || []

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Transaction History</h1>
        <Button onClick={() => dispatch(setCreateTransactionModalOpen(true))}>
          <Plus className="mr-2 h-4 w-4" /> New Transaction
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => dispatch(setTransactionSearchQuery(e.target.value))}
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(value) => dispatch(setTransactionTypeFilter(value as "all" | InventoryTransactionType))}
        >
          <SelectTrigger className="w-40">
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
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading transactions...</div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Product ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>User ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{getProductLabel(transaction.product)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
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
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Modal */}
      <InventoryTransactionForm
        isOpen={isCreateModalOpen}
        onClose={() => dispatch(setCreateTransactionModalOpen(false))}
      />
    </div>
  )
}
