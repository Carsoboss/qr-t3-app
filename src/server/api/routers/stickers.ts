import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
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
  const userId = stickers.map((sticker) => sticker.userTenetId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 1,
    })
  ).map(filterUserForClient);

  return stickers.map((sticker) => {
    const stickerOwner = users.find((user) => user.id === sticker.userTenetId);

    if (!stickerOwner) {
      console.error("AUTHOR NOT FOUND", sticker);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Owner of sticker not found: ${sticker.id}, USER ID: ${sticker.userTenetId}`,
      });
    }
    return {
      sticker,
      stickerOwner: {
        ...stickerOwner,
      },
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
            userTenetId: input.userId,
          },
          take: 100,
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        })
        .then(addUserDataToStickers)
    ),
});
