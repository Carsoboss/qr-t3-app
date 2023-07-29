import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { ContactInfo } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const prisma = new PrismaClient();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, "1 m"),
  analytics: true,
});

const create = {
  FirstName: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1, "First Name Required.").max(50, "First Name is too long."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const clerkUserId = ctx.userId;

      const { success } = await ratelimit.limit(clerkUserId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }),

  LastName: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1, "Last Name Required.").max(50, "Last Name is too long."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const clerkUserId = ctx.userId;

      const { success } = await ratelimit.limit(clerkUserId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }),

  Email: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1, "Email Required.").max(50, "Email is too long.")
        .refine(value => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        }, "Enter Valid Email")
      })
    )
    .mutation(async ({ ctx, input }) => {
      const clerkUserId = ctx.userId;

      const { success } = await ratelimit.limit(clerkUserId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }),

  Phone: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1, "Phone Number Required.").max(15, "Phone Number is too long.")
        .refine(value => {
          const phoneNumberRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
          return phoneNumberRegex.test(value);
        }, "Enter Valid Phone Number")
      })
    )
    .mutation(async ({ ctx, input }) => {
      const clerkUserId = ctx.userId;

      const { success } = await ratelimit.limit(clerkUserId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

    const addContactInfo = await ctx.prisma.contactInfo.create({
      data: {
        clerkUserId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        firstName: input.phone,
      },
    });
      const existingUser = await prisma.contactInfo.findUnique({
        where: { clerkUserId: input.clerkUserId },
      });

      if (existingUser) {
        return existingUser;
      }

      // throw or return if any field is missing and send and error to the client

      try {
        const newUser = await prisma.contactInfo.create({
          data: {
            clerkUserId: input.clerkUserId,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
          },
        });
        return newUser;
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `An error occurred while trying to create a new user: ${error.message}`,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `An error occurred while trying to create a new user`,
        });
      }
    }),

  // create get contact info endpoint. It's a query, not a mutation
  // get contact should return the data if it has all fields

  // create a add user contact info endpoint
  // create an update user contact info endpoint if needed
});
