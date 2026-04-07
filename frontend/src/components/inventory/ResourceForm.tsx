import { useEffect, useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  useGetResourceByIdQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
} from "@/features/inventory/resourceApi"
import { useGetSuppliersQuery } from "@/features/inventory/supplierApi"

interface ResourceFormProps {
  isOpen: boolean
  onClose: () => void
  resourceId?: string
}

export function ResourceForm({ isOpen, onClose, resourceId }: ResourceFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    reorderLevel: 10,
    supplier: "",
    barcode: "",
    isActive: true,
  })

  const { data: resource } = useGetResourceByIdQuery(resourceId || "", {
    skip: !resourceId,
  })

  const { data: suppliersResponse } = useGetSuppliersQuery()
  const suppliers = suppliersResponse?.items || []

  const [createResource, { isLoading: isCreating }] = useCreateResourceMutation()
  const [updateResource, { isLoading: isUpdating }] = useUpdateResourceMutation()

  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name,
        category: resource.category,
        quantity: resource.quantity,
        unit: resource.unit,
        reorderLevel: resource.reorderLevel,
        supplier: resource.supplier,
        barcode: resource.barcode || "",
        isActive: resource.isActive,
      })
    } else if (isOpen && !resourceId) {
      setFormData({
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        reorderLevel: 10,
        supplier: "",
        barcode: "",
        isActive: true,
      })
    }
  }, [resource, isOpen, resourceId])

  const handleSubmit = async () => {
    try {
      if (resourceId) {
        await updateResource({
          id: resourceId,
          ...formData,
        }).unwrap()
      } else {
        await createResource(formData).unwrap()
      }
      onClose()
    } catch (error) {
      console.error("Error saving resource:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{resourceId ? "Edit Resource" : "Create New Resource"}</DialogTitle>
          <DialogDescription>
            {resourceId ? "Update the resource details below." : "Add a new resource to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Resource name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Medical"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., kg, box"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderLevel">Reorder Level *</Label>
              <Input
                id="reorderLevel"
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 10 })}
                placeholder="10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier *</Label>
            <Select value={formData.supplier} onValueChange={(value) => setFormData({ ...formData, supplier: value })}>
              <SelectTrigger id="supplier">
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode (Optional)</Label>
            <Input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              placeholder="e.g., 123456789"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
            />
            <Label htmlFor="isActive" className="font-normal cursor-pointer">
              Active
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
