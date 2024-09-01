import { getSession, Session } from "@auth0/nextjs-auth0";

import { PROMPTS_REPOSITORY } from "../../constants";

export async function POST(request: Request, { params }: { params: { id: string } }) {

    console.log("Use ")

    const { user } = await getSession() as Session;
    console.log(user)

    console.log(await request.json())
    console.log(params.id)

    const prompt = PROMPTS_REPOSITORY.getPromptById(Number(params.id))
    console.log(prompt)

    // TODO implement using a layer of abstraction around openai
    return Response.json({})
}
