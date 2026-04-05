import { Fragment, useMemo } from "react"
import { ChevronRight, ChevronsUpDown, Search, SlidersHorizontal, Users } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import type { AppDispatch, RootState } from "@/store"
import {
  useGetBeneficiariesQuery,
  type Beneficiary,
  type BeneficiaryEligibilityStatus,
} from "@/features/beneficiary/beneficiaryApi"
import {
  clearBeneficiaryFilters,
  setBeneficiarySearchText,
  setEligibilityFilter,
  toggleExpandedBeneficiary,
} from "@/features/beneficiary/beneficiarySlice"

const getEligibilityBadgeClass = (status: BeneficiaryEligibilityStatus) => {
  if (status === "Active") {
    return "bg-[#ebf8ee] text-[#4dbd74]"
  }

  return "bg-slate-100 text-slate-600"
}

export function BeneficiaryDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { searchText, eligibilityFilter, expandedBeneficiaryIds } = useSelector(
    (state: RootState) => state.beneficiary
  )

  const queryParams = useMemo(() => {
    if (eligibilityFilter === "all") {
      return undefined
    }

    return { eligibilityStatus: eligibilityFilter }
  }, [eligibilityFilter])

  const {
    data: beneficiaries = [],
    isLoading,
    isError,
    refetch,
  } = useGetBeneficiariesQuery(queryParams)

  const filteredBeneficiaries = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    return beneficiaries.filter((beneficiary) => {
      if (!normalizedSearch) {
        return true
      }

      return (
        beneficiary.name.toLowerCase().includes(normalizedSearch) ||
        beneficiary.location.toLowerCase().includes(normalizedSearch) ||
        beneficiary.contact.toLowerCase().includes(normalizedSearch) ||
        beneficiary.eligibilityStatus.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [beneficiaries, searchText])

  const handleToggleExpand = (beneficiary: Beneficiary) => {
    dispatch(toggleExpandedBeneficiary(beneficiary._id))
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Beneficiary Management</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 text-slate-700"
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <Input
              className="pl-9 h-10 rounded-xl border-slate-200"
              placeholder="Search by name, location, contact, or status"
              value={searchText}
              onChange={(event) => dispatch(setBeneficiarySearchText(event.target.value))}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={eligibilityFilter}
              onValueChange={(value: "all" | BeneficiaryEligibilityStatus) => {
                dispatch(setEligibilityFilter(value))
              }}
            >
              <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white">
                <SlidersHorizontal className="h-4 w-4 text-slate-500 mr-2" />
                <SelectValue placeholder="Eligibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Eligibility</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="h-10 rounded-xl border-slate-200 text-slate-700"
              onClick={() => dispatch(clearBeneficiaryFilters())}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="w-[48px]" />
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Family Size</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-sm text-slate-500">
                  Loading beneficiaries...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-sm text-rose-600">
                  Failed to load beneficiaries.
                </TableCell>
              </TableRow>
            ) : filteredBeneficiaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-sm text-slate-500">
                  No beneficiaries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBeneficiaries.map((beneficiary) => {
                const isExpanded = expandedBeneficiaryIds.includes(beneficiary._id)

                return (
                  <Fragment key={beneficiary._id}>
                    <TableRow className="hover:bg-slate-50/70">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                          onClick={() => handleToggleExpand(beneficiary)}
                        >
                          {isExpanded ? <ChevronsUpDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{beneficiary.name}</TableCell>
                      <TableCell>{beneficiary.location}</TableCell>
                      <TableCell>{beneficiary.familySize}</TableCell>
                      <TableCell>{beneficiary.contact}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getEligibilityBadgeClass(
                            beneficiary.eligibilityStatus
                          )}`}
                        >
                          {beneficiary.eligibilityStatus}
                        </span>
                      </TableCell>
                    </TableRow>

                    {isExpanded ? (
                      <TableRow className="bg-slate-50/40">
                        <TableCell colSpan={6} className="py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <p className="text-slate-500 mb-1">Beneficiary ID</p>
                              <p className="font-medium text-slate-900 break-all">{beneficiary._id}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <p className="text-slate-500 mb-1">Created At</p>
                              <p className="font-medium text-slate-900">
                                {new Date(beneficiary.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <p className="text-slate-500 mb-1">Updated At</p>
                              <p className="font-medium text-slate-900">
                                {new Date(beneficiary.updatedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !isError && filteredBeneficiaries.length > 0 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <p>Showing {filteredBeneficiaries.length} beneficiaries</p>
          <p className="inline-flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total loaded: {beneficiaries.length}
          </p>
        </div>
      ) : null}
    </div>
  )
}
