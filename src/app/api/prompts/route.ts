import { DDBPromptsRepository } from "@/app/api/repositories/prompts"


export async function GET(request: Request) {

    const promptsRepository = new DDBPromptsRepository()

    return Response.json({ prompts: await promptsRepository.getPrompts(200) })
}
