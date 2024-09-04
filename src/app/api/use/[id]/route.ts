import { getSession, Session } from "@auth0/nextjs-auth0";

import { OPENAI_API_KEY, PROMPTS_REPOSITORY } from "../../constants";
import { TextGenerator } from "../../TextGenerator/TextGenerator";
import { OpenAIStrategy } from "../../TextGenerator/openAIStrategy";
import { MockStrategy } from "../../TextGenerator/mockStrategy";


export async function POST(request: Request, { params }: { params: { id: string } }) {
    // TODO enforce user has paid
    const session = await getSession() as Session;
    if (!session) {
        const res = Response.json({ error: 'User is not authenticated', }, { status: 401 })
        return res
    }

    const prompt = PROMPTS_REPOSITORY.getPromptById(Number(params.id))

    if (!prompt) {
        return Response.json({ error: "Prompt not found" }, { status: 404 })
    }

    const strategy = new MockStrategy("will be returned") // new OpenAIStrategy(OPENAI_API_KEY)/
    const textGenerator = new TextGenerator(strategy)

    const userTextObject = await request.json()
    const userText = Object.keys(userTextObject).map(k => userTextObject[k])

    const generated = await textGenerator.generate(prompt.getFilledPrompt(userText))

    return Response.json({ generated })
}
