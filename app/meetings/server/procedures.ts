import { db } from "@/db";
import { meeting, agent } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Schemas for Create/Update
export const createMeetingSchema = z.object({
  name: z.string().min(1, "Meeting name is required"),
  agentId: z.string().min(1, "An agent must be selected"),
});

export const updateMeetingSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  status: z.enum(["upcoming", "active", "completed", "processing", "cancelled"]).optional(),
  summary: z.string().optional(),
});

export const meetingRouter = createTRPCRouter({
  // Get all meetings for the user (No Pagination)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select({
        id: meeting.id,
        name: meeting.name,
        status: meeting.status,
        createdAt: meeting.createdAt,
        agentId: meeting.agentId,
        agentName: agent.name, // Joined from agent table
      })
      .from(meeting)
      .leftJoin(agent, eq(meeting.agentId, agent.id))
      .where(eq(meeting.userId, ctx.auth.user.id))
      .orderBy(desc(meeting.createdAt));
  }),

  // Get a single meeting's full details
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [existingMeeting] = await db
        .select()
        .from(meeting)
        .where(
          and(
            eq(meeting.id, input.id), 
            eq(meeting.userId, ctx.auth.user.id)
          )
        );

      if (!existingMeeting) {
        throw new TRPCError({ message: "Meeting not found", code: "NOT_FOUND" });
      }
      return existingMeeting;
    }),

  // Create a new meeting
  create: protectedProcedure
    .input(createMeetingSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meeting)
        .values({
          ...input,
          userId: ctx.auth.user.id,
          status: "upcoming",
        })
        .returning();
      return createdMeeting;
    }),

  // Update meeting (Status, Summary, Name)
  update: protectedProcedure
    .input(updateMeetingSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedMeeting] = await db
        .update(meeting)
        .set({ ...updateData, updatedAt: new Date() })
        .where(
          and(
            eq(meeting.id, id), 
            eq(meeting.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!updatedMeeting) {
        throw new TRPCError({ message: "Update failed", code: "NOT_FOUND" });
      }
      return updatedMeeting;
    }),

  // Delete a meeting
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [removedMeeting] = await db
        .delete(meeting)
        .where(
          and(
            eq(meeting.id, input.id), 
            eq(meeting.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!removedMeeting) {
        throw new TRPCError({ message: "Deletion failed", code: "NOT_FOUND" });
      }
      return removedMeeting;
    }),
});