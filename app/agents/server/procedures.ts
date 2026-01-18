import { db } from "@/db";
import { agent } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { createAgentSchema, updateAgentSchema } from "../schema";
import { z } from "zod";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/lib/constants";
import { TRPCError } from "@trpc/server";

export const agentRouter = createTRPCRouter({
update: protectedProcedure.input(updateAgentSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;

    const [updatedAgent] = await db
      .update(agent)
      .set(updateData)
      .where(
        and(
          eq(agent.id, id),
          eq(agent.userId, ctx.auth.user.id)
        )
      )
      .returning();

    if (!updatedAgent) {
      throw new TRPCError({ message: "No Such Agent", code: "NOT_FOUND" });
    }
    return updatedAgent;
  }),
  remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const [removeAgent] = await db
      .delete(agent)
      .where(
        and
          (eq(agent.id, input.id),
            eq(agent.userId, ctx.auth.user.id),
          )
      ).returning()

    if (!removeAgent) {
      throw new TRPCError({ message: "No Such Agent", code: "NOT_FOUND" })
    }
    return removeAgent
  }),
getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE)
          .optional(), // Made optional
        search: z.string().nullish(),
        all: z.boolean().optional(), // Added a flag to bypass pagination
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, pageSize, page, all } = input;

      const whereClause = and(
        eq(agent.userId, ctx.auth.user.id),
        search ? ilike(agent.name, `%${search}%`) : undefined
      );

      // 1. Build the base query
      let query = db
        .select()
        .from(agent)
        .where(whereClause)
        .orderBy(desc(agent.createdAt), desc(agent.id));

      // 2. Only apply limit/offset if 'all' is not true
      if (!all && pageSize) {
        query = query.limit(pageSize).offset((page - 1) * pageSize) as any;
      }

      const data = await query;

      const [{ count: total }] = await db
        .select({ count: count() })
        .from(agent)
        .where(whereClause);

      const effectivePageSize = all ? Number(total) : (pageSize ?? DEFAULT_PAGE_SIZE);
      const totalPages = Math.ceil(Number(total) / (effectivePageSize || 1));

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