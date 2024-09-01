import { PROMPTS_REPOSITORY } from "../../constants"


export async function POST(request: Request) {
    const inputFields = await request.json()

    PROMPTS_REPOSITORY.addPrompt({
        title: inputFields.title,
        promptTexts: inputFields.promptTexts,
        userTextFields: inputFields.promptUserTextFields,
        description: inputFields.description, img: ""
    })

    return Response.json({})
}
