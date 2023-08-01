import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import type { Sticker } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
  };
};

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
    };
  });
};

export const stickerRouter = createTRPCRouter({
  // gets all stickers for the logged in user
  getStickersByUser: protectedProcedure.query(async ({ ctx }) => {
    const stickers = await ctx.prisma.sticker
      .findMany({
        include: {
          stickerType: true,
          ownerContactInfo: true,
        },
        where: {
          ownerId: ctx.userId,
        },
        take: 100,
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      })
      .then(addUserDataToStickers);

    return stickers;
  }),
  // gets a sticker based on the passed id
  getStickerById: publicProcedure
    .input(z.object({ stickerId: z.string() }))
    .query(({ ctx, input }) => {
      const sticker = ctx.prisma.sticker.findFirst({
        include: {
          ownerContactInfo: true,
        },
        where: {
          id: input.stickerId,
        },
      });
      return sticker;
    }),
});
