import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateTransactionMutation,
} from "@/features/inventory/inventoryTransactionApi"
import { useGetResourcesQuery } from "@/features/inventory/resourceApi"
import type { InventoryTransactionType } from "@/features/inventory/inventoryTransactionApi"

const LARGE_FETCH_LIMIT = 1000

const getApiErrorMessage = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return "Request failed. Please try again."
  }

  const maybeError = error as { data?: unknown }
  const data = maybeError.data

  if (data && typeof data === "object") {
    const maybeMessage = data as { message?: unknown; error?: unknown }

    if (typeof maybeMessage.message === "string" && maybeMessage.message.trim().length > 0) {
      return maybeMessage.message
    }

    if (typeof maybeMessage.error === "string" && maybeMessage.error.trim().length > 0) {
      return maybeMessage.error
    }
  }

  return "Request failed. Please try again."
}

interface InventoryTransactionFormProps {
  isOpen: boolean
  onClose: () => void
}

const transactionTypes: InventoryTransactionType[] = ["ADD", "REMOVE", "TRANSFER"]

export function InventoryTransactionForm({ isOpen, onClose }: InventoryTransactionFormProps) {
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    product: "",
    type: "ADD" as InventoryTransactionType,
    quantity: "1",
    reason: "",
    date: today,
  })
  const [formError, setFormError] = useState("")

  const { data: resourcesResponse } = useGetResourcesQuery({
    page: 1,
    limit: LARGE_FETCH_LIMIT,
  })
  const resources = resourcesResponse?.items || []

  const [createTransaction, { isLoading }] = useCreateTransactionMutation()

  const handleSubmit = async () => {
    const quantity = Number(formData.quantity)
    const reason = formData.reason.trim()

    if (!formData.product) {
      setFormError("Please select a resource.")
      return
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      setFormError("Quantity must be 1 or greater.")
      return
    }

    if (!reason) {
      setFormError("Reason is required.")
      return
    }

    if (formData.date > today) {
      setFormError("Date cannot be in the future.")
      return
    }

    setFormError("")

    try {
      await createTransaction({
        product: formData.product,
        type: formData.type,
        quantity,
        reason,
        date: formData.date,
      }).unwrap()

      setFormData({
        product: "",
        type: "ADD",
        quantity: "1",
        reason: "",
        date: today,
      })
      setFormError("")
      onClose()
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Inventory Transaction</DialogTitle>
          <DialogDescription>Record a new inventory transaction for your resources.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product *</Label>
            <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
              <SelectTrigger id="product">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {resources.map((resource) => (
                  <SelectItem key={resource._id} value={resource._id}>
                    {resource.name} ({resource.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  type: value as InventoryTransactionType,
                })
              }
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                max={today}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="e.g., Stock replenishment, Damage, Transfer to branch"
            />
          </div>

          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
