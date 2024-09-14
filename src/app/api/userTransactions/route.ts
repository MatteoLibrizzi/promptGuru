import { getSession, Session } from "@auth0/nextjs-auth0";
import { DDBUsersRepository } from "@/app/api/repositories/users";


export async function GET(request: Request) {
    const session = await getSession() as Session;
    if (!session?.user) {
        const res = Response.json({ error: 'User is not authenticated', }, { status: 401 })
        return res
    }

    const usersRepository = new DDBUsersRepository()
    await usersRepository.createUserIfNotExistent(session.user.sub)

    const transactions = await usersRepository.getUserTransactions(session.user.sub)

    return Response.json({ transactions })
}
