import { PromptModel, UserTextField } from "../../Model/Prompt";
import { PromptsRepository } from "../../Repositories/prompts";

export const addPromptHandler = async (promptsRepository: PromptsRepository, title: string, description: string, userTextFields: UserTextField[], img: string, promptTexts: string[], categories: string[]) => {
    const id = await promptsRepository.getNewId()
    // TODO use Img
    const prompt = new PromptModel(title, description, userTextFields, "", promptTexts, [], id)
    await promptsRepository.addPrompt(prompt)

    categories.forEach(async (category) => await promptsRepository.addCategoryToPrompt(id, category))
}