// components/SimpleChat.tsx
"use client";
import React, { useRef, useState } from "react";

type Msg = { id: string; from: "user" | "bot"; text: string };

export default function SimpleChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "sys-1", from: "bot", text: "Halo — tanya apa saja tentang Paycombat (mis. database, transaksi, dst.)." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef(`sess-${Math.random().toString(36).slice(2,9)}`);
  const listRef = useRef<HTMLDivElement | null>(null);

  function push(m: Msg) {
    setMessages((p) => {
      const next = [...p, m];
      setTimeout(() => listRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 50);
      return next;
    });
  }

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const id = `u-${Date.now()}`;
    push({ id, from: "user", text });
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatInput: text,
          sessionId: sessionIdRef.current,
          user: "web",
        }),
      });

      const j = await res.json().catch(() => null);

      if (!res.ok) {
        push({ id: `err-${Date.now()}`, from: "bot", text: `Error: ${j?.error ?? res.statusText}` });
      } else {
        // prefer j.reply, fallback to j.raw or generic text
        const replyText =
          (j && (j.reply || (typeof j.raw === "string" ? j.raw : undefined))) ??
          (j && j.raw && typeof j.raw === "object" ? JSON.stringify(j.raw) : null) ??
          "Maaf, tidak ada jawaban.";

        push({ id: `b-${Date.now()}`, from: "bot", text: String(replyText) });
      }
    } catch (err: any) {
      push({ id: `err-${Date.now()}`, from: "bot", text: "Network error: " + String(err?.message ?? err) });
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="max-w-3xl mx-auto h-[74vh] flex flex-col border rounded-md overflow-hidden">
      <div className="bg-slate-50 p-3 border-b">Paycombat Copilot</div>

      <div ref={listRef} className="flex-1 p-4 overflow-auto bg-white space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`${m.from === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"} p-3 rounded-md max-w-[80%]`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">agent is thinking...</div>}
      </div>

      <div className="p-3 border-t flex gap-2 items-center">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Ketik pesan... (Enter untuk kirim)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={loading}
        />
        <button onClick={send} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
}
