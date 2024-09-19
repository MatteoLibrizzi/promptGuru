import { APP_URL, STRIPE } from "@/app/api/constants";

const webhookEndpoint = STRIPE.webhookEndpoints.create({
    enabled_events: ['checkout.session.completed', 'checkout.session.async_payment_succeeded'],
    url: `${APP_URL}/api/stripe/webhook`
});