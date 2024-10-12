"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export const EditButton = ({
  postText,
  postId,
}: {
  postText: string | null;
  postId: number;
}) => {
  const router = useRouter();

  const [text, setText] = useState(postText ?? "");
  const [open, setOpen] = useState(false);

  const { mutate: update, isPending } = api.post.update.useMutation({
    onSuccess: () => {
      toast.success("Post updated");
      setOpen(false);
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update post");
    },
  });

  const onClick = () => {
    if (text.length === 0) return;
    update({ id: postId, text });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="opacity-0 group-hover:opacity-100"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your post</DialogTitle>
          <DialogDescription>修改你的帖子</DialogDescription>
        </DialogHeader>
        <Input value={text} onChange={(e) => setText(e.target.value)} />
        <Button onClick={onClick} disabled={isPending}>
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
};
