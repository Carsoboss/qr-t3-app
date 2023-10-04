import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { DeviceType, type Sticker } from "@prisma/client";
import { TRPCError } from "@trpc/server";

// posting a new sticker use this func
// const filterUserForClient = (user: User) => {
//   return {
//     id: user.id,
//   };
// };

const addUserDataToSticker = async (sticker: Sticker | null) => {
  if (!sticker) {
    console.error("STICKER NOT FOUND", sticker);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Sticker is missing from function addUserDataToSticker()",
    });
  }

  const userId = sticker.userId;

  const stickerOwner = await clerkClient.users.getUser(userId);

  if (!stickerOwner) {
    console.error("AUTHOR NOT FOUND", sticker);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Owner of sticker not found: ${sticker.id}, USER ID: ${sticker.userId}`,
    });
  }
  return { sticker, owner: stickerOwner };
};

export const stickerRouter = createTRPCRouter({
  getStickersByUser: protectedProcedure.query(async ({ ctx }) => {
    const stickers = await ctx.prisma.sticker.findMany({
      where: {
        userId: ctx.userId,
      },
      include: {
        stickerType: true,
      },
      take: 100,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });

    return stickers;
  }),

  updateDeviceType: protectedProcedure
    .input(
      z.object({
        stickerId: z.string(),
        newDeviceType: z.nativeEnum(DeviceType),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedSticker = await ctx.prisma.sticker.update({
        where: {
          id: input.stickerId,
        },
        data: {
          deviceType: input.newDeviceType,
        },
      });

      return updatedSticker;
    }),
  // gets a sticker based on the passed id
  getStickerById: publicProcedure
    .input(z.object({ stickerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const sticker = await ctx.prisma.sticker
        .findFirst({
          include: {
            stickerType: true,
          },
          where: {
            id: input.stickerId,
          },
        })
        .then(addUserDataToSticker);

      if (!sticker) {
        throw new TRPCError({
          message: "Could not retrieve the sticker",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return sticker;
    }),
});
