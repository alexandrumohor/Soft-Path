import { anthropic, AI_MODEL, AI_MAX_TOKENS } from "@/lib/ai/client";
import { buildSystemPrompt } from "@/lib/ai/prompts/system";
import type { ToughLoveLevel } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { messages, topic, toughLove = "BALANCED", locale = "en" } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
      topic?: string; toughLove?: ToughLoveLevel; locale?: string;
    };
    if (!messages?.length) return new Response(JSON.stringify({ error: "Messages required" }), { status: 400 });
    if (!process.env.ANTHROPIC_API_KEY) return new Response(JSON.stringify({ error: "AI not configured. Add ANTHROPIC_API_KEY to .env.local" }), { status: 503 });

    const systemPrompt = buildSystemPrompt({ topic, toughLove, locale, learnerProfile: null });
    const stream = await anthropic.messages.stream({ model: AI_MODEL, max_tokens: AI_MAX_TOKENS, system: systemPrompt, messages });
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta")
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text: event.delta.text })}\n\n`));
          }
          const final = await stream.finalMessage();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done", usage: { input: final.usage.input_tokens, output: final.usage.output_tokens } })}\n\n`));
          controller.close();
        } catch (e) { controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", error: e instanceof Error ? e.message : "Stream error" })}\n\n`)); controller.close(); }
      },
    });
    return new Response(readable, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
  } catch (error) { console.error("AI Chat error:", error); return new Response(JSON.stringify({ error: "Failed" }), { status: 500 }); }
}
