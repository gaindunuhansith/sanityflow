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

interface InventoryTransactionFormProps {
  isOpen: boolean
  onClose: () => void
}

const transactionTypes: InventoryTransactionType[] = ["ADD", "REMOVE", "TRANSFER"]

export function InventoryTransactionForm({ isOpen, onClose }: InventoryTransactionFormProps) {
  const [formData, setFormData] = useState({
    product: "",
    type: "ADD" as InventoryTransactionType,
    quantity: 1,
    reason: "",
    date: new Date().toISOString().split("T")[0],
  })

  const { data: resourcesResponse } = useGetResourcesQuery()
  const resources = resourcesResponse?.items || []

  const [createTransaction, { isLoading }] = useCreateTransactionMutation()

  const handleSubmit = async () => {
    try {
      if (!formData.product || !formData.reason || formData.quantity <= 0) {
        alert("Please fill all required fields")
        return
      }

      await createTransaction({
        ...formData,
        quantity: parseInt(formData.quantity.toString()),
      }).unwrap()

      setFormData({
        product: "",
        type: "ADD",
        quantity: 1,
        reason: "",
        date: new Date().toISOString().split("T")[0],
      })
      onClose()
    } catch (error) {
      console.error("Error creating transaction:", error)
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
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                placeholder="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
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
