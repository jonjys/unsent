import Stripe from "stripe";
export async function POST(req) {
  const { text } = await req.json().catch(() => ({}));
  const line = String(text || "").trim();
  if (line.length < 2 || line.length > 140) return Response.json({ error: "Write the text first." }, { status: 400 });
  if (!process.env.STRIPE_SECRET_KEY) return Response.json({ error: "Card checkout is not connected yet. The card above still works." }, { status: 500 });
  try {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = process.env.NEXT_PUBLIC_URL || new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID || "price_1UNHSBBEo0Yzuylwet71piRA", quantity: 1 }],
    success_url: `${origin}/clean?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: origin,
    metadata: { app: "unsent", text: line }
  });
  return Response.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}
