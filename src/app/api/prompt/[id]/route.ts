import { PROMPTS_REPOSITORY } from "../../constants"


export async function GET(request: Request, { params }: { params: { id: string } }) {

    //TODO add data validation
    const requestedPrompt = PROMPTS_REPOSITORY.getPromptById(Number(params.id))

    console.log(requestedPrompt)

    if (!requestedPrompt) {
        return Response.json({ error: "Prompt not found" }, { status: 404 })
    }

    return Response.json({ ...requestedPrompt })
}
