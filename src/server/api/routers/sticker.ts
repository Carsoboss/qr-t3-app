import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const stickerRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    // @ts-expect-error - ctx.prisma is not typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return ctx.prisma.example.findMany();
  }),
});
