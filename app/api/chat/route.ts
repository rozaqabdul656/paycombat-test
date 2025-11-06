// app/api/chat/route.ts  (Edge runtime ok)
import { NextResponse } from 'next/server';
export const runtime = 'edge';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const chatInput = body.chatInput ?? "berapa total transaksi payin di table payin ?";
  const sessionId = body.sessionId ?? "sess-test-123455";
  const user = body.user ?? "rozaq";
  console.log("API Chat Input:", { chatInput, sessionId, user });
  const webhookUrl = "https://rozaq.app.n8n.cloud/webhook/f3f8da85-3ccf-44fd-8a98-bff0edc767a0";

  const payload = { sessionId, action: "sendMessage", chatInput, user };

  try {
    const r = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    let n8nData: any = null;
    const ct = r.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      n8nData = await r.json().catch(() => null);
    } else {
      n8nData = await r.text().catch(() => null);
    }
    // Extract reply — adjust if your n8n returns different key
    const reply =
      (n8nData && (n8nData.reply || n8nData.output || n8nData.message || n8nData.result)) ??
      (typeof n8nData === "string" ? n8nData : null) ??
      "Tidak ada jawaban dari agent";
    console.log("API Chat Reply:", n8nData);
    return NextResponse.json({ success: r.ok, reply, raw: n8nData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
