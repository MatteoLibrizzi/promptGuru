export async function GET(request: Request) {
    const prompts = [{
        title: "CV Updater",
        id: 0,
        promptTexts: [
            "You are an expect in Job Hunting and carreer development. You have to help a candidate modify his curriculum for a specific position. Given the following Curriculum, modify it to fit the job description that will be provided after. Here is the curriculum in markdown format:",
            "And here is the job description:",
            "Provide the modified curriculum in markdown format"
        ],
        userTextFields: [
            "Curriculum Markdown",
            "User Text Fields"
        ]
    }]
    return Response.json({ prompts })
}
