import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { clinic } from "@/lib/clinic";
import { isCloudApiConfigured, sendText } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Meta webhook verification handshake. */
export function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const token = process.env.WHATSAPP_VERIFY_TOKEN;
  if (token && p.get("hub.mode") === "subscribe" && p.get("hub.verify_token") === token) {
    return new NextResponse(p.get("hub.challenge") ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

function validSignature(raw: string, header: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(raw).digest("hex"));
  const given = Buffer.from(header.slice("sha256=".length));
  return given.length === expected.length && timingSafeEqual(given, expected);
}

interface InboundMessage {
  from?: string;
  type?: string;
  text?: { body?: string };
}

/** Inbound patient messages: reply with a friendly auto-response and the booking link. */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!validSignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: { entry?: { changes?: { value?: { messages?: InboundMessage[] } }[] }[] };
  try {
    payload = JSON.parse(raw);
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  if (isCloudApiConfigured()) {
    const messages = payload.entry?.flatMap((e) => e.changes ?? []).flatMap((c) => c.value?.messages ?? []) ?? [];
    await Promise.all(
      messages
        .filter((m) => m.type === "text" && m.from)
        .map((m) => {
          const text = m.text?.body ?? "";
          const isBookingRequest = /\bRef:\s*\S+/i.test(text);
          const reply = isBookingRequest
            ? `Thank you! We've received your appointment request and will confirm your slot shortly. ${clinic.shortName} Dental`
            : `Hello and welcome to ${clinic.name}! 😊\n\nBook an appointment in 2 minutes: ${siteUrl()}/book\nOur treatments & prices: ${siteUrl()}/services\n\nOr just reply here with your question and our team will get back to you during clinic hours.`;
          return sendText(m.from!, reply);
        }),
    );
  }
  // Always 200 so Meta doesn't retry
  return NextResponse.json({ received: true });
}
