import { useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCreateBeneficiaryMutation } from "@/features/beneficiary/beneficiaryApi"

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

const validateForm = ({
  name,
  location,
  contact,
  familySize,
}: {
  name: string
  location: string
  contact: string
  familySize: number
}) => {
  if (!name || !location || !contact) {
    return "All fields are required."
  }

  if (name.length < 2) {
    return "Name must be at least 2 characters."
  }

  if (location.length < 2) {
    return "Location must be at least 2 characters."
  }

  if (contact.length < 5) {
    return "Contact must be at least 5 characters."
  }

  if (!Number.isInteger(familySize) || familySize < 1) {
    return "Family size must be a whole number greater than 0."
  }

  return null
}

export function MemberBeneficiarySubmission() {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [familySize, setFamilySize] = useState("1")
  const [contact, setContact] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [createBeneficiary, { isLoading }] = useCreateBeneficiaryMutation()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedLocation = location.trim()
    const trimmedContact = contact.trim()
    const parsedFamilySize = Number(familySize)

    const validationError = validateForm({
      name: trimmedName,
      location: trimmedLocation,
      contact: trimmedContact,
      familySize: parsedFamilySize,
    })

    if (validationError) {
      setErrorMessage(validationError)
      setSuccessMessage("")
      return
    }

    setErrorMessage("")

    try {
      await createBeneficiary({
        name: trimmedName,
        location: trimmedLocation,
        familySize: parsedFamilySize,
        contact: trimmedContact,
      }).unwrap()

      setSuccessMessage("Beneficiary submitted successfully. It is now pending admin review.")
      setName("")
      setLocation("")
      setFamilySize("1")
      setContact("")
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
      setSuccessMessage("")
    }
  }

  return (
    <div className="max-w-3xl">
      <Card className="rounded-2xl border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Submit Beneficiary</CardTitle>
          <CardDescription>
            Add a new beneficiary for approval. Submissions from members are saved with Pending status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="member-beneficiary-name">Name</Label>
              <Input
                id="member-beneficiary-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Beneficiary full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="member-beneficiary-location">Location</Label>
              <Input
                id="member-beneficiary-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Village, district, or area"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="member-beneficiary-family-size">Family Size</Label>
              <Input
                id="member-beneficiary-family-size"
                type="number"
                min={1}
                value={familySize}
                onChange={(event) => setFamilySize(event.target.value)}
                placeholder="1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="member-beneficiary-contact">Contact</Label>
              <Input
                id="member-beneficiary-contact"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="Phone or contact details"
              />
            </div>

            {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
            {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

            <Button type="submit" disabled={isLoading} className="bg-[#0F392B] hover:bg-[#0F392B]/90 text-white">
              {isLoading ? "Submitting..." : "Submit Beneficiary"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
