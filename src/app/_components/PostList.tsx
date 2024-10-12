import type { PostGetAllOutput } from "~/server/api/routers/post";
import { format } from "date-fns";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";

export const PostList = ({ posts }: { posts: PostGetAllOutput }) => {
  return (
    <div className="grid w-[900px] gap-3 divide-y rounded-lg border border-gray-300 p-4">
      {posts.map((post) => (
        <div key={post.id} className="group flex flex-col">
          <div className="flex justify-between text-sm text-gray-400">
            <p>{post.user?.username ?? ""}</p>
            <p>{format(post.createdAt, "Pp")}</p>
          </div>

          <p className="text-xl">{post.text}</p>
          <div className="ml-auto flex gap-2">
            <EditButton postText={post.text} postId={post.id} />
            <DeleteButton postId={post.id} />
          </div>
        </div>
      ))}
    </div>
  );
};
