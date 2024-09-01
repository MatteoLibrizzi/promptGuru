import { PROMPTS_REPOSITORY } from "../../constants"


export async function GET(request: Request, { params }: { params: { id: string } }) {

    //TODO add data validation
    const requestedPrompt = PROMPTS_REPOSITORY.getPromptById(Number(params.id))


    return Response.json({ ...requestedPrompt })
}
