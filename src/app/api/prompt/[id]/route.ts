import { DDBPromptsRepository } from "@/app/api/repositories/prompts"

export async function GET(request: Request, { params }: { params: { id: string } }) {

    const promptsRepository = new DDBPromptsRepository()
    //TODO add data validation
    const requestedPrompt = await promptsRepository.getPromptById(params.id)

    if (!requestedPrompt) {
        return Response.json({ error: "Prompt not found" }, { status: 404 })
    }

    return Response.json({ ...requestedPrompt })
}
