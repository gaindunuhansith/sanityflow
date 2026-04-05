import { useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
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
import { AlertCircle, Loader2 } from "lucide-react"
import { useCreateIssueMutation } from "@/features/issues/issueApi"

const createIssueSchema = z.object({
  issueType: z.enum(['Water Quality', 'Water Shortage', 'Infrastructure', 'Other']),
  description: z.string().min(5, 'Description is required (min 5 chars)'),
  location: z.string().min(1, 'Location is required'),
  priority: z.enum(['Low', 'Medium', 'High']).optional().default('Medium')
})

type CreateIssueFormValues = z.infer<typeof createIssueSchema>

export function ReportIssueForm() {
  const navigate = useNavigate()
  const [createIssue, { isLoading, error }] = useCreateIssueMutation()

  const { control, register, handleSubmit, formState: { errors } } = useForm<CreateIssueFormValues>({
    resolver: zodResolver(createIssueSchema) as any,
    defaultValues: {
      priority: 'Medium'
    }
  })

  const onSubmit = async (data: CreateIssueFormValues) => {
    try {
      await createIssue(data).unwrap()
      navigate('/issues')
    } catch (err) {
      console.error('Failed to create issue:', err)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 max-w-3xl mx-auto mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Report New Issue</h1>
        <p className="text-gray-500 text-sm">Please provide detailed information about the issue so our maintenance team can address it promptly.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Failed to submit the issue. Please try again.</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-700 font-semibold">Location<span className="text-red-500 ml-1">*</span></Label>
          <Input 
            id="location" 
            placeholder="e.g., Sector 4 Main Valve" 
            {...register("location")}
            className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-emerald-500" 
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Category<span className="text-red-500 ml-1">*</span></Label>
            <Controller
              name="issueType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-emerald-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Water Quality">Water Quality</SelectItem>
                    <SelectItem value="Water Shortage">Water Shortage</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.issueType && <p className="text-red-500 text-xs mt-1">{errors.issueType.message}</p>}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Priority Level</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-emerald-500">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-700 font-semibold">Detailed Description<span className="text-red-500 ml-1">*</span></Label>
          <Textarea 
            id="description" 
            {...register("description")}
            placeholder="Please describe the issue in detail, including any specific location details or visible symptoms..." 
            className="min-h-[120px] rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-emerald-500 resize-y" 
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Important Note</p>
            <p>If this is a health-critical water quality issue, please also immediately contact the emergency dispatch line at (555) 019-9922 after submitting this form.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={() => navigate('/issues')} className="h-11 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="h-11 px-8 rounded-xl bg-[#0F392B] hover:bg-[#0F392B]/90 text-white font-medium shadow-sm">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Issue Report
          </Button>
        </div>
      </form>
    </div>
  )
}