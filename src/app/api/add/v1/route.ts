import { PROMPTS_REPOSITORY } from "../../constants"
import { PromptModel } from "../../Model/Prompt"
import { addPromptHandler } from "./addPromptHandler"


export async function POST(request: Request) {
    const inputFields = await request.json()

    const prompt = new PromptModel(inputFields.title, inputFields.description, inputFields.promptUserTextFields, "", inputFields.promptTexts)
    addPromptHandler(PROMPTS_REPOSITORY, prompt)

    return Response.json({})
}
