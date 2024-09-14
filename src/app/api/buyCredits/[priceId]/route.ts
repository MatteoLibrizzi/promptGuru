import { DDBUsersRepository } from "@/app/api/repositories/users";
import { getSession, Session } from "@auth0/nextjs-auth0";
import { STRIPE, STRIPE_CANCEL_URL, STRIPE_SUCCESS_URL } from "../../constants";
import { CreditsPriceProvider } from "../../CreditsPriceProvider";


export async function GET(request: Request, { params }: { params: { priceId: string } }) {

    const session = await getSession() as Session;
    if (!session?.user) {
        const res = Response.json({ error: 'User is not authenticated', }, { status: 401 })
        return res
    }

    if (!CreditsPriceProvider.doesPriceIdExist(params.priceId)) {
        return Response.json({ error: 'Invalid price ID' }, { status: 400 })
    }

    const stripeSession = await STRIPE.checkout.sessions.create({
        mode: 'payment',
        line_items: [
            {
                price: params.priceId,
                quantity: 1,
            },
        ],
        success_url: STRIPE_SUCCESS_URL,
        cancel_url: STRIPE_CANCEL_URL
    })

    const usersRepository = new DDBUsersRepository()

    await usersRepository.createCheckoutSession(session.user.sub, stripeSession.id, params.priceId)

    return Response.json({ url: stripeSession.url })
}
