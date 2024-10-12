import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { clerkClient } from "~/lib/clerk";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import type { RouterOutputs } from "~/trpc/react";

type Outputs = RouterOutputs["post"];
export type PostGetAllOutput = Outputs["all"];

export const postRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    const users = await clerkClient.users.getUserList({
      limit: 500,
      userId: post.map((p) => p.userId),
    });

    return post.map((p) => ({
      ...p,
      user: users.data.find((u) => u.id === p.userId) ?? null,
    }));
  }),
  create: protectedProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        userId: ctx.userId,
        text: input.text,
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.number(), text: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.db
        .update(posts)
        .set({ text: input.text })
        .where(and(eq(posts.id, input.id), eq(posts.userId, ctx.userId)))
        .returning({ updatedId: posts.id });

      if (res.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can only update your own posts",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.db
        .delete(posts)
        .where(and(eq(posts.id, input.id), eq(posts.userId, ctx.userId)))
        .returning({ updatedId: posts.id });

      if (res.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can only delete your own posts",
        });
      }
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),
});
