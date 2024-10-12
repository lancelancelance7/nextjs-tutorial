"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export const SendPost = () => {
  const [text, setText] = useState("");

  const router = useRouter();

  const { mutate: sendPost, isPending } = api.post.create.useMutation({
    onSuccess: () => {
      setText("");
      router.refresh();
      toast.success("Post sent");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onClick = () => {
    if (text.length === 0) return;
    sendPost({ name: "name", text });
  };

  return (
    <div className="grid w-96 gap-4">
      <Input
        placeholder="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={onClick} disabled={isPending}>
        Send
      </Button>
    </div>
  );
};
