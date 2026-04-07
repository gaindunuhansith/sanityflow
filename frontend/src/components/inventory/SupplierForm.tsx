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
  const [formError, setFormError] = useState("")

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
      setFormError("")
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
      setFormError("")
    }
  }, [supplier, isOpen, supplierId])

  const handleSubmit = async () => {
    const name = formData.name.trim()
    const rating = Number(formData.reliabilityRating)
    const email = formData.contact.email.trim()
    const phone = formData.contact.phone.trim()
    const address = formData.contact.address.trim()

    if (!name) {
      setFormError("Supplier name is required.")
      return
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setFormError("Reliability rating must be between 1 and 5.")
      return
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setFormError("Please enter a valid email address.")
      return
    }

    setFormError("")

    try {
      if (supplierId) {
        await updateSupplier({
          id: supplierId,
          name,
          contact: {
            email: email || undefined,
            phone: phone || undefined,
            address: address || undefined,
          },
          reliabilityRating: rating,
        }).unwrap()
      } else {
        await createSupplier({
          name,
          contact: {
            email: email || undefined,
            phone: phone || undefined,
            address: address || undefined,
          },
          reliabilityRating: rating,
        }).unwrap()
      }
      onClose()
    } catch (error) {
      setFormError(getApiErrorMessage(error))
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
