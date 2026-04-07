import { useEffect, useState } from "react"
import { ScanLine } from "lucide-react"
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
  useGetResourceByBarcodeQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
} from "@/features/inventory/resourceApi"
import { useGetSuppliersQuery } from "@/features/inventory/supplierApi"

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
  const [formError, setFormError] = useState("")
  const [barcodeInfo, setBarcodeInfo] = useState("")
  const [barcodeLookupValue, setBarcodeLookupValue] = useState("")

  const { data: resource } = useGetResourceByIdQuery(resourceId || "", {
    skip: !resourceId,
  })

  const {
    data: barcodeResource,
    isFetching: isLookingUpBarcode,
    isError: isBarcodeLookupError,
  } = useGetResourceByBarcodeQuery(barcodeLookupValue, {
    skip: !barcodeLookupValue,
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
      setFormError("")
      setBarcodeInfo("")
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
      setFormError("")
      setBarcodeInfo("")
      setBarcodeLookupValue("")
    }
  }, [resource, isOpen, resourceId])

  useEffect(() => {
    if (!barcodeLookupValue) {
      return
    }

    if (barcodeResource && !resourceId) {
      setFormData((previous) => ({
        ...previous,
        name: barcodeResource.name || previous.name,
        category: barcodeResource.category || previous.category,
        unit: barcodeResource.unit || previous.unit,
      }))
      setBarcodeInfo("Barcode matched an existing resource. Fields have been auto-filled.")
      return
    }

    if (isBarcodeLookupError) {
      setBarcodeInfo("No resource found for this barcode.")
    }
  }, [barcodeLookupValue, barcodeResource, isBarcodeLookupError, resourceId])

  const handleBarcodeLookup = () => {
    const barcode = formData.barcode.trim()

    if (!barcode) {
      setBarcodeInfo("Enter a barcode to lookup.")
      return
    }

    setBarcodeInfo("")
    setBarcodeLookupValue(barcode)
  }

  const handleSubmit = async () => {
    const name = formData.name.trim()
    const category = formData.category.trim()
    const unit = formData.unit.trim()
    const supplier = formData.supplier.trim()
    const barcode = formData.barcode.trim()
    const quantity = Number(formData.quantity)
    const reorderLevel = Number(formData.reorderLevel)

    if (!name || !category || !unit || !supplier) {
      setFormError("Name, category, unit and supplier are required.")
      return
    }

    if (!Number.isFinite(quantity) || quantity < 0) {
      setFormError("Quantity must be 0 or greater.")
      return
    }

    if (!Number.isFinite(reorderLevel) || reorderLevel < 0) {
      setFormError("Reorder level must be 0 or greater.")
      return
    }

    setFormError("")

    try {
      if (resourceId) {
        await updateResource({
          id: resourceId,
          name,
          category,
          quantity,
          unit,
          reorderLevel,
          supplier,
          barcode,
          isActive: formData.isActive,
        }).unwrap()
      } else {
        await createResource({
          name,
          category,
          quantity,
          unit,
          reorderLevel,
          supplier,
          barcode,
          isActive: formData.isActive,
        }).unwrap()
      }
      onClose()
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{resourceId ? "Edit Resource" : "Create New Resource"}</DialogTitle>
          <DialogDescription>
            {resourceId ? "Update the resource details below." : "Add a new resource to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="e.g., 123456789"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleBarcodeLookup}
                disabled={isLookingUpBarcode}
              >
                <ScanLine className="mr-2 h-4 w-4" />
                {isLookingUpBarcode ? "Looking up..." : "Lookup"}
              </Button>
            </div>
            {barcodeInfo ? <p className="text-xs text-gray-600">{barcodeInfo}</p> : null}
          </div>

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

          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
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
