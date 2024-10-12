import { api, HydrateClient } from "~/trpc/server";
import { SendPost } from "./_components/SendPost";
import { PostList } from "./_components/PostList";

export default async function Home() {
  const posts = await api.post.all();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <PostList posts={posts} />
        <SendPost />
      </main>
    </HydrateClient>
  );
}
