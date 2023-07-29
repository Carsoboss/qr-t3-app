import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { Sticker } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { UserTenet } from "@prisma/client";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
  };
};
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, "1 m"),
  analytics: true,
});

const addUserDataToStickers = async (stickers: Sticker[]) => {
  const userId = stickers.map((sticker) => sticker.ownerId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 1,
    })
  ).map(filterUserForClient);

  return stickers.map((sticker) => {
    const stickerOwner = users.find((user) => user.id === sticker.ownerId);

    if (!stickerOwner) {
      console.error("AUTHOR NOT FOUND", sticker);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Owner of sticker not found: ${sticker.id}, USER ID: ${sticker.ownerId}`,
      });
    }
    return {
      sticker,
      owner: {
        ...stickerOwner,
      },
      // userTenet,
      // contacts: {
      //   ...UserTenet,
      // },
    };
  });
};

export const stickerRouter = createTRPCRouter({

  getStickersByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) =>
      ctx.prisma.sticker
        .findMany({
          where: {
            ownerId: input.userId,
          },
          take: 100,
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        })
        .then(addUserDataToStickers)
    ),
    const create = {
      FirstName: protectedProcedure
        .input(
          z.object({
            content: z.string().min(1, "First Name Required.").max(50, "First Name is too long."),
          })
        )
        .mutation(async ({ ctx, input }) => {
          const ownerId = ctx.userId;
    
          const { success } = await ratelimit.limit(ownerId);
          if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
        }),
    
      LastName: protectedProcedure
        .input(
          z.object({
            content: z.string().min(1, "Last Name Required.").max(50, "Last Name is too long."),
          })
        )
        .mutation(async ({ ctx, input }) => {
          const ownerId = ctx.userId;
    
          const { success } = await ratelimit.limit(ownerId);
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
          const ownerId = ctx.userId;
    
          const { success } = await ratelimit.limit(ownerId);
          if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
        }),
    
      PhoneNumber: protectedProcedure
        .input(
          z.object({
            content: z.string().min(1, "Phone Number Required.").max(50, "Phone Number is too long.")
            .refine(value => {
              const phoneNumberRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
              return phoneNumberRegex.test(value);
            }, "Enter Valid Phone Number")
          })
        )
        .mutation(async ({ ctx, input }) => {
          const ownerId = ctx.userId;
    
          const { success } = await ratelimit.limit(ownerId);
          if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
        })
    };