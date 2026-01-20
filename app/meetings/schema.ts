import {z} from "zod"

export const createMeetingSchema = z.object({
  name: z.string().min(1, "Meeting name is required"),
  agentId: z.string().min(1, "An agent must be selected"),
});
export const MeetingStatusEnum = z.enum([
  "upcoming",
  "active",
  "completed",
  "processing",
  "cancelled",
]);
export const meetingFormSchema = z.object({
  name: z.string().min(1, "Meeting name is required"),
  agentId: z.string().min(1, "Please select an agent"),
});
export const updateMeetingSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  agentId: z.string().optional(),
  status: MeetingStatusEnum.optional(),
  startedAt: z.coerce.date().optional(),
  endedAt: z.coerce.date().optional(),
  summary: z.string().optional(),
  transcriptUrl: z.string().url().optional().or(z.literal("")),
  recordingUrl: z.string().url().optional().or(z.literal("")),
});
export const meetingIdSchema = z.object({
  id: z.string(),
});