import { PromptModel, UserTextField } from "@/app/api/Model/Prompt";
import { PromptsRepository } from "@/app/api/repositories/prompts";

export const addPromptHandler = async (promptsRepository: PromptsRepository, title: string, description: string, userTextFields: UserTextField[], img: string, promptTexts: string[], categories: string[], userId: string) => {
    const id = await promptsRepository.getNewId()
    // TODO use Img
    
    const prompt = new PromptModel(title, description, userTextFields, "", promptTexts, [], id, userId)
    await promptsRepository.addPrompt(prompt)

    categories.forEach(async (category) => await promptsRepository.addCategoryToPrompt(id, category))
}