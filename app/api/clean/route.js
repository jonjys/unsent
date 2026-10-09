import Stripe from "stripe";
export async function POST(req) {
  const { session_id } = await req.json().catch(() => ({}));
  if (typeof session_id !== "string" || !session_id.startsWith("cs_")) return Response.json({ error: "Not paid." }, { status: 402 });
  let session;
  try {
    session = await new Stripe(process.env.STRIPE_SECRET_KEY).checkout.sessions.retrieve(session_id);
  } catch {
    return Response.json({ error: "Could not verify payment. Please reload." }, { status: 502 });
  }
  if (session.payment_status !== "paid" || session.metadata?.app !== "unsent") return Response.json({ error: "Not paid." }, { status: 402 });
  return Response.json({ text: session.metadata.text });
}
