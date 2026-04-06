import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ClipboardEdit, Loader2, AlertCircle } from "lucide-react"
import { useGetIssueByIdQuery, useUpdateIssueMutation } from "@/features/issues/issueApi"

const updateIssueSchema = z.object({
  status: z.enum(['Pending', 'In Progress', 'Resolved']).optional(),
  resolutionNotes: z.string().optional()
})

type UpdateIssueFormValues = z.infer<typeof updateIssueSchema>

export function UpdateIssueForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { data: issueData, isLoading: isLoadingIssue, error: loadError } = useGetIssueByIdQuery(id as string, { skip: !id })
  const [updateIssue, { isLoading: isUpdating, error: updateError }] = useUpdateIssueMutation()

  const issue = issueData

  const { register, handleSubmit, reset, control } = useForm<UpdateIssueFormValues>({
    resolver: zodResolver(updateIssueSchema),
    defaultValues: {
      status: issue?.status || 'Pending',
      resolutionNotes: issue?.resolutionNotes || ''
    }
  })

  useEffect(() => {
    if (issue) {
      reset({
        status: issue.status,
        resolutionNotes: issue.resolutionNotes || ''
      })
    }
  }, [issue, reset])

  const onSubmit = async (data: UpdateIssueFormValues) => {
    if (!id) return
    try {
      await updateIssue({ id, body: data }).unwrap()
      navigate('/issues')
    } catch (err) {
      console.error('Failed to update issue:', err)
    }
  }

  if (isLoadingIssue) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#0F392B] h-8 w-8" /></div>
  }

  if (loadError || !issue) {
    return <div className="text-center text-red-500 p-10 font-medium">Issue not found or failed to load.</div>
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
          <ClipboardEdit className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Update Issue Status</h1>
          <p className="text-gray-500 text-sm">Update progress, change status, or add resolution notes.</p>
        </div>
      </div>

      {updateError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p>Failed to update issue. Please try again.</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Read-only Issue info */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{issue.location}</span>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-md text-[11px] font-semibold bg-gray-200 text-gray-700">
               {issue.issueType}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-base">{issue.description.substring(0, 60)}{issue.description.length > 60 ? '...' : ''}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Current Status<span className="text-red-500 ml-1">*</span></Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-emerald-500">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Update Description/Notes */}
        <div className="space-y-2">
          <Label htmlFor="resolutionNotes" className="text-gray-700 font-semibold">Resolution Notes</Label>
          <Textarea 
            id="resolutionNotes" 
            {...register("resolutionNotes")}
            placeholder="Describe what actions have been taken, any delays, or why the status is changing..." 
            className="min-h-[120px] rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-emerald-500 resize-y" 
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={() => navigate('/issues')} className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating} className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            {isUpdating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Save Update
          </Button>
        </div>
      </form>
    </div>
  )
}