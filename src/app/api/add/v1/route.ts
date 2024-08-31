import { GET_UNIQUE_ID, PROMPTS } from "../../mockStorage"

export async function POST(request: Request) {


    const inputFields = await request.json()

    PROMPTS.push({
        title: inputFields.title,
        id: GET_UNIQUE_ID(),
        promptTexts: inputFields.promptTexts,
        userTextFields: inputFields.promptUserTextFields,
        description: inputFields.description
    })

    console.log(PROMPTS)
    return Response.json({})
}
