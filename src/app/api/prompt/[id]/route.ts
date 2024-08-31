import { PROMPTS } from "../../mockStorage"

export async function GET(request: Request, { params }: { params: { id: string } }) {
    console.log(request)
    console.log(params)

    //TODO add data validation
    const requestedPrompt = PROMPTS.find(prompt => prompt.id === params.id)
    return Response.json({ ...requestedPrompt })
}
