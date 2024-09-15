import { STRIPE, STRIPE_ENDPOINT_SECRET } from "../../constants";
import { CreditsPriceProvider } from "../../CreditsPriceProvider";
import { DDBUsersRepository } from "../../repositories/users";


export async function POST(request: Request) {
    const sig = request.headers.get('stripe-signature') || "";

    let event;

    const body = await request.text()

    try {
        event = STRIPE.webhooks.constructEvent(body, sig, STRIPE_ENDPOINT_SECRET);
    } catch (err) {
        console.error("Error during event creation: ", err)
        return Response.json({ error: JSON.stringify(err) }, { status: 400 })
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            const usersRepository = new DDBUsersRepository()

            if (checkoutSessionCompleted.status !== 'complete') {
                return Response.json({ error: 'checkout session not complete' }, { status: 400 })
            }

            const checkoutSession = await usersRepository.getCheckoutSessionById(checkoutSessionCompleted.id)

            await usersRepository.confirmPaymentForCheckoutSession(checkoutSessionCompleted.id, checkoutSession.checkoutTimestamp)

            const numberOfCredits = CreditsPriceProvider.priceIdToCredits(checkoutSession.priceId)

            await usersRepository.addTransaction(checkoutSession.userId, {
                amount: numberOfCredits,
                description: "Credits",
                transactionTimestamp: Date.now()
            })

            break

        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;

            break
        default:

    }


    return Response.json({})
}
