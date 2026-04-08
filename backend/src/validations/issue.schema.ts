import { z } from 'zod';

// Schema for creating a new issue
export const createIssueSchema = z.object({
  issueType: z.enum(['Water Quality', 'Water Shortage', 'Infrastructure', 'Other']),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  photo: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional()
});

// Schema for updating an issue (all fields admin can modify)
export const updateIssueSchema = z.object({
  issueType: z.enum(['Water Quality', 'Water Shortage', 'Infrastructure', 'Other']).optional(),
  description: z.string().min(1, 'Description cannot be empty').optional(),
  location: z.string().min(1, 'Location cannot be empty').optional(),
  photo: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  status: z.enum(['Pending', 'In Progress', 'Resolved']).optional(),
  assignedTo: z.string().optional(),
  resolutionNotes: z.string().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
});

// Keep old export for backward compatibility
export const updateIssueStatusSchema = z.object({
  status: z.enum(['Pending', 'In Progress', 'Resolved'])
});
