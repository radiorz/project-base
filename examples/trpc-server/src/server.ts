import { db } from "./db";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  userList: publicProcedure.input(z.string()).query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    const users = await db.user.findMany();

    return users;
  }),
  // ...
  userById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts; // Retrieve the user with the given ID
    const user = await db.user.findById(input);
    return user;
  }),
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts; // Create a new user in the database
      const user = await db.user.create(input);
      return user;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
