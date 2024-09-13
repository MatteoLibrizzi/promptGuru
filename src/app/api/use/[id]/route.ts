import { getSession, Session } from "@auth0/nextjs-auth0";

import { TextGenerator } from "@/app/api/TextGenerator/TextGenerator";
import { MockStrategy } from "@/app/api/TextGenerator/mockStrategy";
import { createUserIfNotExistent } from "@/app/utils";
import { DDBPromptsRepository } from "@/app/api/Repositories/prompts";


export async function POST(request: Request, { params }: { params: { id: string } }) {
    // TODO enforce user has paid
    const session = await getSession() as Session;
    if (!session?.user) {
        const res = Response.json({ error: 'User is not authenticated', }, { status: 401 })
        return res
    }
    await createUserIfNotExistent(session.user.sub)

    const promptsRepository = new DDBPromptsRepository()

    const prompt = await promptsRepository.getPromptById(params.id)

    if (!prompt) {
        return Response.json({ error: "Prompt not found" }, { status: 404 })
    }

    const strategy = new MockStrategy("will be returned") // new OpenAIStrategy(OPENAI_API_KEY)/
    const textGenerator = new TextGenerator(strategy)

    const userTextObject = await request.json()
    const userText = Object.keys(userTextObject).map(k => userTextObject[k])

    const textGenerationOutput = await textGenerator.generate(prompt.getFilledPrompt(userText))

    return Response.json({ generated: textGenerationOutput.output })
}
