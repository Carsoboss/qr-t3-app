import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { DeviceType, type Sticker } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "@qrfound/server/db";

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

  if (!userId) {
    console.error("Invalid userId:", userId);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Invalid userId provided to addUserDataToSticker()",
    });
  }

  // Fetch the sticker owner

  const stickerOwner = await clerkClient.users.getUser(userId);
  if (!stickerOwner) {
    console.error("AUTHOR NOT FOUND", sticker);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Owner of sticker not found: ${sticker.id}, USER ID: ${sticker.userId}`,
    });
  }

  // Fetch the sticker type
  const typeofSticker = await prisma.stickerType.findUnique({
    where: { id: sticker.stickerTypeId },
  });

  if (!typeofSticker) {
    console.error("STICKER TYPE NOT FOUND", sticker);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Type of sticker not found for sticker ID: ${sticker.id}`,
    });
  }

  return { sticker, owner: stickerOwner, stickerType: typeofSticker };
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
      const sticker = await ctx.prisma.sticker.findFirst({
        include: {
          stickerType: true,
        },
        where: {
          id: input.stickerId,
        },
      });

      if (!sticker) {
        console.error(
          "Sticker not found in database for sticker ID:",
          input.stickerId
        );
        throw new TRPCError({
          message: "Sticker not found in the database",
          code: "NOT_FOUND",
        });
      }

      // If the sticker doesn't have a userId and the user is not authenticated.
      if (!sticker.userId && !ctx.userId) {
        throw new TRPCError({
          message: "Authentication required",
          code: "UNAUTHORIZED",
        });
      }

      // If the sticker doesn't have a userId, assign the current user to it.
      if (!sticker.userId && ctx.userId) {
        await ctx.prisma.sticker.update({
          where: { id: sticker.id },
          data: { userId: ctx.userId },
        });
        sticker.userId = ctx.userId;
      }
      const result = await addUserDataToSticker(sticker);

      // Check if result contains an error and throw a TRPCError if it does
      if ("error" in result) {
        console.error(result.error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return result;
    }),
});
