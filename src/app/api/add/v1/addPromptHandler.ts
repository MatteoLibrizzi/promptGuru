import { PromptModel } from "../../Model/Prompt";
import { PromptsRepository } from "../../repositories/prompts";

export const addPromptHandler = (promptsRepository: PromptsRepository, prompt: PromptModel) => {
    promptsRepository.addPrompt(prompt)
}