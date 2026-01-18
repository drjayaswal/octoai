import { db } from "@/db";
import { agent } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { createAgentSchema } from "../schema";
import { z } from "zod";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/lib/constants";

export const agentRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, pageSize, page } = input;

      const whereClause = and(
        eq(agent.userId, ctx.auth.user.id),
        search ? ilike(agent.name, `%${search}%`) : undefined
      );

      const data = await db
        .select()
        .from(agent)
        .where(whereClause)
        .orderBy(desc(agent.createdAt), desc(agent.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [{ count: total }] = await db
        .select({ count: count() })
        .from(agent)
        .where(whereClause);

      const totalPages = Math.ceil(Number(total) / pageSize);

      return {
        items: data,
        total: Number(total),
        totalPages,
      };
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [existingAgent] = await db
        .select()
        .from(agent)
        .where(eq(agent.id, input.id));
      return existingAgent;
    }),
  create: protectedProcedure
    .input(createAgentSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agent)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();
      return createdAgent;
    }),
});