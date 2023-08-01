import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { UserContactInfo } from "@prisma/client";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(9, "1 m"),
  analytics: true,
});

export const userRouter = createTRPCRouter({
  addContactInfo: protectedProcedure
    .input(
      z.object({
        firstName: z
          .string()
          .min(1, {
            message: "First name must be at least 1 character",
          })
          .max(35, { message: "First name cannot be more than 35 characters" }),
        lastName: z
          .string()
          .min(1, {
            message: "Last name must be at least 1 character",
          })
          .max(35, { message: "Last name cannot be more than 35 characters" }),
        email: z.string().email({ message: "Please add a valid email" }),
        phone: z
          .string()
          .min(10, { message: "Please add a valid phone number" })
          .max(14, { message: "Please add a valid phone number" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const clerkUserId = ctx.userId;

      const { success } = await ratelimit.limit(clerkUserId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const contactInfo = await ctx.prisma.userContactInfo.create({
        data: {
          clerkUserId,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
        },
      });

      return contactInfo;
    }),
  getContactInfo: protectedProcedure.query(async ({ ctx }) => {
    const contactInfo = await ctx.prisma.userContactInfo.findUnique({
      where: { clerkUserId: ctx.userId },
    });

    if (!contactInfo) throw new TRPCError({ code: "NOT_FOUND" });

    return contactInfo;
  }),
});
