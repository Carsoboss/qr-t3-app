import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(9, "1 m"),
//   analytics: true,
// });

export const userRouter = createTRPCRouter({
  addContactInfo: protectedProcedure
    .input(
      z.object({
        email: z.string().email({ message: "Please add a valid email" }),
        phone: z
          .string()
          .min(10, { message: "Please add a valid phone number" })
          .max(14, { message: "Please add a valid phone number" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const contactInfo = await ctx.prisma.userContactInfo.create({
        data: {
          userId,
          email: input.email,
          phone: input.phone,
        },
      });
      return contactInfo;
    }),
  updateContactInfo: protectedProcedure
    .input(
      z.object({
        email: z.string().email({ message: "Please add a valid email" }),
        phone: z
          .string()
          .min(10, { message: "Please add a valid phone number" })
          .max(14, { message: "Please add a valid phone number" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const clerkUserId = ctx.userId;
      const contactInfo = await ctx.prisma.userContactInfo.update({
        where: { userId: clerkUserId },
        data: {
          email: input.email,
          phone: input.phone,
        },
      });
      return contactInfo;
    }),

  getContactInfo: protectedProcedure.query(async ({ ctx }) => {
    const contactInfo = await ctx.prisma.userContactInfo.findUnique({
      where: { userId: ctx.userId },
    });
    if (!contactInfo) throw new TRPCError({ code: "NOT_FOUND" });
    return contactInfo;
  }),
});
