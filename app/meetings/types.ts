export type MeetingData = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  agentId: string;
  status: "upcoming" | "active" | "completed" | "processing" | "cancelled";
  startedAt: string | null;
  endedAt: string | null;
  transcriptUrl: string | null;
  recordingUrl: string | null;
  summary: string | null;
};