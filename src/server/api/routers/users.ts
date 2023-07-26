import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const prisma = new PrismaClient();

export const userRouter = createTRPCRouter({
  getOrCreateUser: protectedProcedure
    .input(
      z.object({
        clerkUserId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phone: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await prisma.userTenet.findUnique({
        where: { clerkUserId: input.clerkUserId },
      });

      if (existingUser) {
        return existingUser;
      }

      // throw or return if any field is missing and send and error to the client

      try {
        const newUser = await prisma.userTenet.create({
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
  // rename table to be contact info instead of tenet
  // create get contact info endpoint. It's a query, not a mutation
  // get contact should return the data if it has all fields

  // create a add user contact info endpoint
  // create an update user contact info endpoint if needed
});
