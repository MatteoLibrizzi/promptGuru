import { PromptModel } from "../../Model/Prompt";
import { PromptsRepository } from "../../Repositories/prompts";

export const addPromptHandler = async (promptsRepository: PromptsRepository, prompt: PromptModel) => {
    promptsRepository.addPrompt(prompt)
}