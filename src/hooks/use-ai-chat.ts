"use client";

import { useState, useCallback, useRef } from "react";
import type { ToughLoveLevel } from "@/types";

export interface ChatMessage { id: string; role: "user" | "assistant"; content: string; createdAt: Date; isStreaming?: boolean; }

export function useAIChat(options: { topic?: string; toughLove?: ToughLoveLevel; locale?: string } = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    setError(null);
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: content.trim(), createdAt: new Date() };
    const asstId = crypto.randomUUID();
    const asstMsg: ChatMessage = { id: asstId, role: "assistant", content: "", createdAt: new Date(), isStreaming: true };
    setMessages((prev) => [...prev, userMsg, asstMsg]);
    setIsLoading(true);

    const apiMessages = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
    try {
      abortRef.current = new AbortController();
      const res = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: apiMessages, ...options }), signal: abortRef.current.signal });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed"); }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim().startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.trim().slice(6));
            if (data.type === "text") setMessages((p) => p.map((m) => m.id === asstId ? { ...m, content: m.content + data.text } : m));
            else if (data.type === "done") setMessages((p) => p.map((m) => m.id === asstId ? { ...m, isStreaming: false } : m));
            else if (data.type === "error") throw new Error(data.error);
          } catch (e) { if (e instanceof SyntaxError) continue; throw e; }
        }
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages((p) => p.map((m) => m.id === asstId ? { ...m, content: m.content || "Sorry, I couldn't process your request.", isStreaming: false } : m));
    } finally { setIsLoading(false); abortRef.current = null; }
  }, [messages, isLoading, options]);

  const stopGenerating = useCallback(() => { abortRef.current?.abort(); setIsLoading(false); setMessages((p) => p.map((m) => m.isStreaming ? { ...m, isStreaming: false } : m)); }, []);
  const clearMessages = useCallback(() => { setMessages([]); setError(null); }, []);
  return { messages, isLoading, error, sendMessage, stopGenerating, clearMessages };
}
