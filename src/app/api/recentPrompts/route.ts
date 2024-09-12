import { DDBPromptsRepository } from "../Repositories/prompts"


export async function GET(request: Request) {

    const promptsRepository = new DDBPromptsRepository()

    return Response.json({ prompts: await promptsRepository.getRecentPrompts(200) })
}
