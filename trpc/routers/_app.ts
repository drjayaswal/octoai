import { createTRPCRouter } from '../init';
import { agentRouter } from '@/app/agents/server/procedures';

export const appRouter = createTRPCRouter({
  agents: agentRouter,
});
export type AppRouter = typeof appRouter;