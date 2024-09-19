import { APP_URL, STRIPE } from "@/app/api/constants";
import Stripe from "stripe";

// TODO figure out how to deploy the webhook programmatically, you can't just run the code separately, because you need the secret to sign the requests
// let webhookEndpoint: Stripe.WebhookEndpoint

// export const GET_STRIPE_WEBHOOK_ENDPOINT_SECRET = async () => {
//     if (!webhookEndpoint) {
//         webhookEndpoint = await STRIPE.webhookEndpoints.create({
//             enabled_events: ['checkout.session.completed', 'checkout.session.async_payment_succeeded'],
//             url: `${APP_URL}/api/stripe/webhook`
//         });
//     }

//     return webhookEndpoint.secret
// }
