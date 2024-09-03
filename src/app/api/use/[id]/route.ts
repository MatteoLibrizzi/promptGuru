import { getSession, Session } from "@auth0/nextjs-auth0";

import { PROMPTS_REPOSITORY } from "../../constants";
import { TextGenerator } from "../../TextGenerator/TextGenerator";
import { OpenAIStrategy } from "../../TextGenerator/openAIStrategy";
import { MockStrategy } from "../../TextGenerator/mockStrategy";


export async function POST(request: Request, { params }: { params: { id: string } }) {

    console.log("Use ")

    const userTextObject = await request.json()
    const userText = Object.keys(userTextObject).map(k => userTextObject[k])

    // TODO enforce auth in the frontend
    // TODO ensure route is unusable if not auth
    // const { user } = await getSession() as Session;

    const prompt = PROMPTS_REPOSITORY.getPromptById(Number(params.id))


    if (!prompt) {
        return Response.json({})
    }
    const strategy = new MockStrategy("will be returned")
    const textGenerator = new TextGenerator(strategy)

    const generated = await textGenerator.generate(prompt.getFilledPrompt(userText))

    return Response.json({ generated })
}
