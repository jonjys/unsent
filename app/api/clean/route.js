import Stripe from "stripe";
export async function POST(req) {
  const { session_id } = await req.json().catch(() => ({}));
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid" || session.metadata?.app !== "unsent") return Response.json({ error: "Not paid." }, { status: 402 });
  return Response.json({ text: session.metadata.text });
}
