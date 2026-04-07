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
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "@/features/inventory/supplierApi"

interface SupplierFormProps {
  isOpen: boolean
  onClose: () => void
  supplierId?: string
}

export function SupplierForm({ isOpen, onClose, supplierId }: SupplierFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact: {
      email: "",
      phone: "",
      address: "",
    },
    reliabilityRating: 3,
  })

  const { data: supplier } = useGetSupplierByIdQuery(supplierId || "", {
    skip: !supplierId,
  })

  const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation()
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation()

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact: {
          email: supplier.contact?.email || "",
          phone: supplier.contact?.phone || "",
          address: supplier.contact?.address || "",
        },
        reliabilityRating: supplier.reliabilityRating,
      })
    } else if (isOpen && !supplierId) {
      setFormData({
        name: "",
        contact: {
          email: "",
          phone: "",
          address: "",
        },
        reliabilityRating: 3,
      })
    }
  }, [supplier, isOpen, supplierId])

  const handleSubmit = async () => {
    try {
      if (supplierId) {
        await updateSupplier({
          id: supplierId,
          ...formData,
        }).unwrap()
      } else {
        await createSupplier(formData).unwrap()
      }
      onClose()
    } catch (error) {
      console.error("Error saving supplier:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{supplierId ? "Edit Supplier" : "Create New Supplier"}</DialogTitle>
          <DialogDescription>
            {supplierId ? "Update the supplier details below." : "Add a new supplier to your system."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Supplier Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Supplier name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.contact.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value },
                })
              }
              placeholder="supplier@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.contact.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, phone: e.target.value },
                })
              }
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.contact.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, address: e.target.value },
                })
              }
              placeholder="123 Main St, City"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Reliability Rating (1-5)</Label>
            <select
              id="rating"
              value={formData.reliabilityRating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reliabilityRating: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
            >
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
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
