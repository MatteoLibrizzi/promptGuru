export const PROMPT = {
    title: "CV Updater",
    id: 'abc',
    promptTexts: [
        "You are an expect in Job Hunting and carreer development. You have to help a candidate modify his curriculum for a specific position. Given the following Curriculum, modify it to fit the job description that will be provided after. Here is the curriculum in markdown format:",
        "And here is the job description:",
        "Provide the modified curriculum in markdown format"
    ],// TODO this should not be returned
    userTextFields: [
        { fieldName: "Curriculum Markdown", fieldDescription: "Descr" },
        { fieldName: "User Text Fields", fieldDescription: "Descr" },

    ], description: "testPrompt"
}
let latestId = 'abc'
export const GET_UNIQUE_ID = () => {
    latestId += 'a'
    return latestId
}
export const PROMPTS = [
    PROMPT
]