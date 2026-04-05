import { useState } from "react";

export function useTypingEffect() {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  async function streamText(fullText: string, speed = 15) {
    setIsStreaming(true);
    setText("");

    for (let i = 0; i < fullText.length; i++) {
      await new Promise((r) => setTimeout(r, speed));
      setText((prev) => prev + fullText[i]);
    }

    setIsStreaming(false);
  }

  return { text, isStreaming, streamText };
}
