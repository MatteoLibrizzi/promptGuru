import { HardcodedPromptCategoriesRepository } from "@/app/api/repositories/promptCategories"

export async function GET(request: Request) {

    const promptsRepository = new HardcodedPromptCategoriesRepository()

    const allSubcategories = await promptsRepository.getAllSubcategories()

    return Response.json({ ...allSubcategories })
}
