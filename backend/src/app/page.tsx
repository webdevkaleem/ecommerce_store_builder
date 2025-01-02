import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <h1>Preview - Admin</h1>
    </HydrateClient>
  );
}
