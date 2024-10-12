import type { PostGetAllOutput } from "~/server/api/routers/post";
import { format } from "date-fns";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { auth } from "@clerk/nextjs/server";
import { cn } from "~/lib/utils";

export const PostList = ({ posts }: { posts: PostGetAllOutput }) => {
  const session = auth();
  const userId = session.userId;

  return (
    <div className="grid max-h-[65vh] w-[900px] gap-3 divide-y overflow-y-auto rounded-lg border border-gray-300 p-4">
      {posts.map((post) => (
        <div key={post.id} className="group flex flex-col">
          <div className="flex justify-between text-sm text-gray-400">
            <p>{post.user?.username ?? ""}</p>
            <p>{format(post.createdAt, "Pp")}</p>
          </div>

          <p className="text-xl">{post.text}</p>
          <div
            className={cn(
              "ml-auto flex gap-2 opacity-0",
              userId === post.userId && "opacity-100",
            )}
          >
            <EditButton postText={post.text} postId={post.id} />
            <DeleteButton postId={post.id} />
          </div>
        </div>
      ))}
    </div>
  );
};
