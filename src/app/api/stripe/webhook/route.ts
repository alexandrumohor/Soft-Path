import { NextResponse } from "next/server";
import { stripe, tierFromPriceId } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  if (!db) return NextResponse.json({ error: "DB not configured" }, { status: 503 });

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Use `any` for Stripe event objects since API versions change type shapes frequently
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = (event.data as any).object;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const userId = obj.metadata?.userId ?? obj.subscription_details?.metadata?.userId;
        if (!userId || !obj.subscription) break;

        const sub = await stripe.subscriptions.retrieve(obj.subscription as string);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subAny = sub as any;
        const priceId = subAny.items?.data?.[0]?.price?.id as string | undefined;
        const tier = priceId ? tierFromPriceId(priceId) : null;

        await db.subscription.update({
          where: { userId },
          data: {
            stripeSubscriptionId: subAny.id,
            stripeCustomerId: obj.customer as string,
            stripePriceId: priceId,
            tier: tier ?? "FREE",
            status: subAny.status === "trialing" ? "TRIALING" : "ACTIVE",
            currentPeriodStart: subAny.current_period_start ? new Date(subAny.current_period_start * 1000) : null,
            currentPeriodEnd: subAny.current_period_end ? new Date(subAny.current_period_end * 1000) : null,
            trialEnd: subAny.trial_end ? new Date(subAny.trial_end * 1000) : null,
          },
        });
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        if (!obj.subscription) break;

        const sub = await stripe.subscriptions.retrieve(obj.subscription as string);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subAny = sub as any;
        const userId = subAny.metadata?.userId;
        if (!userId) break;

        if (event.type === "invoice.paid") {
          const priceId = subAny.items?.data?.[0]?.price?.id as string | undefined;
          const tier = priceId ? tierFromPriceId(priceId) : null;
          await db.subscription.update({
            where: { userId },
            data: {
              status: "ACTIVE",
              tier: tier ?? undefined,
              currentPeriodStart: subAny.current_period_start ? new Date(subAny.current_period_start * 1000) : undefined,
              currentPeriodEnd: subAny.current_period_end ? new Date(subAny.current_period_end * 1000) : undefined,
            },
          });
        } else {
          await db.subscription.update({ where: { userId }, data: { status: "PAST_DUE" } });
        }
        break;
      }

      case "customer.subscription.updated": {
        const userId = obj.metadata?.userId;
        if (!userId) break;

        const priceId = obj.items?.data?.[0]?.price?.id as string | undefined;
        const tier = priceId ? tierFromPriceId(priceId) : null;

        await db.subscription.update({
          where: { userId },
          data: {
            tier: tier ?? undefined,
            status: obj.cancel_at_period_end ? "CANCELLED" : obj.status === "trialing" ? "TRIALING" : "ACTIVE",
            cancelAtPeriodEnd: obj.cancel_at_period_end ?? false,
            currentPeriodStart: obj.current_period_start ? new Date(obj.current_period_start * 1000) : undefined,
            currentPeriodEnd: obj.current_period_end ? new Date(obj.current_period_end * 1000) : undefined,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const userId = obj.metadata?.userId;
        if (!userId) break;

        await db.subscription.update({
          where: { userId },
          data: { tier: "FREE", status: "CANCELLED", stripeSubscriptionId: null, stripePriceId: null, cancelAtPeriodEnd: false },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
