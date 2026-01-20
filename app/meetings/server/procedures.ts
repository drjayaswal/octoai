import { db } from "@/db";
import { meeting, agent } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/components/ui/generate-avatar-uri";
import { createMeetingSchema, meetingIdSchema, updateMeetingSchema } from "../schema";

export const meetingRouter = createTRPCRouter({
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    await streamVideo.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name,
        role: "admin",
        image:
          ctx.auth.user.image ?? generateAvatarUri({ seed: ctx.auth.user.name, variant: "initials" }),
      }
    ])
    const expirationTime = Math.floor(Date.now() / 1000) + 3600
    const issuedAt = Math.floor(Date.now() / 1000) - 60

    const token = streamVideo.generateUserToken({
      user_id: ctx.auth.user.id,
      exp: expirationTime,
      validity_in_seconds: issuedAt
    })

    return token
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select({
        id: meeting.id,
        name: meeting.name,
        status: meeting.status,
        createdAt: meeting.createdAt,
        endedAt: meeting.endedAt,
        agentId: meeting.agentId,
        agentName: agent.name,
      })
      .from(meeting)
      .leftJoin(agent, eq(meeting.agentId, agent.id))
      .where(eq(meeting.userId, ctx.auth.user.id))
      .orderBy(desc(meeting.createdAt));
  }),
  getOne: protectedProcedure
    .input(meetingIdSchema)
    .query(async ({ input }) => {
      const [existingMeeting] = await db
        .select()
        .from(meeting)
        .where(
          and(
            eq(meeting.id, input.id),
          )
        );

      if (!existingMeeting) {
        throw new TRPCError({ message: "Meeting not found", code: "NOT_FOUND" });
      }
      return existingMeeting;
    }),
  create: protectedProcedure
    .input(createMeetingSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meeting)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      const call = streamVideo.video.call("default", createdMeeting.id)
      await call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            meetingId: createdMeeting.id,
            meetingName: createdMeeting.name,
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on"
            },
            recording: {
              mode: "auto-on",
              quality: "1080p"
            }
          }
        }
      })

      const [existingAgent] = await db.select().from(agent).where(eq(agent.id, createdMeeting.agentId))
      if (!existingAgent) {
        throw new TRPCError({ message: "Agent not found", code: "NOT_FOUND" });
      }

      await streamVideo.upsertUsers([
        {
          id: existingAgent.id,
          name: existingAgent.name,
          role: "user",
          image:
            ctx.auth.user.image ?? generateAvatarUri({ seed: existingAgent.name, variant: "botttsNeutral" }),
        }
      ])
      return createdMeeting;
    }),
  update: protectedProcedure
    .input(updateMeetingSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedMeeting] = await db
        .update(meeting)
        .set({
          ...updateData,
          ...(updateData.status === "active" ? { startedAt: new Date() } : {}),
          ...(updateData.status === "completed" ? { endedAt: new Date() } : {}),
          updatedAt: new Date(),
        })
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
  remove: protectedProcedure
    .input(meetingIdSchema)
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