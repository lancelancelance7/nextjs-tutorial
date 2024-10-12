"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const SendPost = () => {
  const [text, setText] = useState("");

  const onClick = () => {
    console.log("clicked", text);
  };

  return (
    <div className="grid w-40 gap-4">
      <Input
        placeholder="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={onClick}>Click me</Button>
    </div>
  );
};
