import { meetingRouter } from '@/app/meetings/server/procedures';
import { createTRPCRouter } from '../init';
import { agentRouter } from '@/app/agents/server/procedures';

export const appRouter = createTRPCRouter({
  agents: agentRouter,
  meetings: meetingRouter,
});
export type AppRouter = typeof appRouter;