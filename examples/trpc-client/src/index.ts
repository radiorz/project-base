import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../../trpc-server/src/server';
//     👆 **type-only** import
async function bootstrap() {
  // Pass AppRouter as generic here. 👇 This lets the `trpc` object know
  // what procedures are available on the server and their input/output types.
  const client = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000',
      }),
    ],
  });
  const user = await client.userById.query('1');
  console.log(`user`, user);
  const createdUser = await client.userCreate.mutate({ name: 'sachinraja' });
  console.log(`createdUser`, createdUser);
}
bootstrap();
