import { createTRPCRouter } from "./trpc";
import { stickerRouter } from "./routers/stickers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  sticker: stickerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
