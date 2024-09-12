import { getSession, Session } from "@auth0/nextjs-auth0"
import { FREE_CREDITS_CENTS } from "../../constants"
import { PromptModel } from "../../Model/Prompt"
import { addPromptHandler } from "./addPromptHandler"
import { DDBUsersRepository } from "../../Repositories/users";
import { createUserIfNotExistent } from "@/app/utils";
import { DDBPromptsRepository } from "../../Repositories/prompts";


export async function POST(request: Request) {
    const session = await getSession() as Session;
    if (!session?.user) {
        const res = Response.json({ error: 'User is not authenticated', }, { status: 401 })
        return res
    }
    await createUserIfNotExistent(session.user.sub)

    const inputFields = await request.json()

    const promptsRepository = new DDBPromptsRepository()
    await addPromptHandler(promptsRepository, inputFields.title, inputFields.description, inputFields.promptUserTextFields, "", inputFields.promptTexts, inputFields.categories)

    return Response.json({})
}
