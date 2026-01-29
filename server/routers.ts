import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getUserById, deductCreditsAndSaveGeneration, getUserGenerations } from "./db";
import { nanoid } from "nanoid";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await getUserById(ctx.user.id);
    }),
  }),

  generation: router({
    generate: protectedProcedure
      .input(z.object({
        originalImage: z.string().optional(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await getUserById(ctx.user.id);
        if (!user) {
          throw new Error("User not found");
        }
        if (user.credits < 1) {
          throw new Error("Insufficient credits");
        }

        const mockResultImage = await new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve("https://via.placeholder.com/1080x1440?text=XHS+Cover");
          }, 2000);
        });

        await deductCreditsAndSaveGeneration(ctx.user.id, {
          id: nanoid(),
          originalImage: input.originalImage,
          resultImage: mockResultImage,
          title: input.title,
          subtitle: input.subtitle,
        });

        return {
          resultImage: mockResultImage,
        };
      }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return await getUserGenerations(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
