import { eq } from "drizzle-orm";
import { z } from "zod";
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
    return post;
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        text: input.text,
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.number(), text: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(posts)
        .set({ text: input.text })
        .where(eq(posts.id, input.id));
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(posts).where(eq(posts.id, input.id));
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),
});
