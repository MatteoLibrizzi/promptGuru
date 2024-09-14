import { getSession, Session } from "@auth0/nextjs-auth0";
import { addPromptHandler } from "./addPromptHandler";
import { UsersRepository } from "../../repositories/users";
import { PromptsRepository } from "../../repositories/prompts";
import { ImageHostingRepository } from "../../repositories/imageHosting";

const handler = async (request: Request, usersRepo: UsersRepository, promptsRepo: PromptsRepository, imageHostingRepository: ImageHostingRepository) => {
    const session = await getSession() as Session;
    if (!session?.user) {
        const res = Response.json({ error: 'User is not authenticated', }, { status: 401 })
        return res
    }

    await usersRepo.createUserIfNotExistent(session.user.sub)

    const inputFields = await request.json()


    await addPromptHandler(promptsRepo, imageHostingRepository, inputFields.title, inputFields.description, inputFields.promptUserTextFields, "", inputFields.promptTexts, inputFields.categories, session.user.sub)

    return Response.json({})
}

export default handler