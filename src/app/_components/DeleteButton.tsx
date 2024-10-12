"use client";

import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const DeleteButton = ({ postId }: { postId: number }) => {
  const router = useRouter();

  const { mutate: deletePost, isPending } = api.post.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Post deleted");
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const onClick = () => {
    deletePost({ id: postId });
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      className="opacity-0 group-hover:opacity-100"
      onClick={onClick}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};
