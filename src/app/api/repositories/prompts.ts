interface Prompt {
    title: string
    description: string
    promptTexts: string[]
    userTextFields: { name: string, description: string }[]
    img: string
}

interface InternalPrompt extends Prompt {
    id: number
}
export abstract class PromptsRepository {
    abstract getPromptById: (id: number) => Prompt | undefined
    abstract addPrompt: (prompt: Prompt) => void
    abstract findPromptsByKeyword: (keyword: string) => Prompt[]
    abstract getRecentPrompts: (limit: number) => Prompt[]
}

const PROMPT = {
    title: "CV Updater",
    id: 0,
    promptTexts: [
        "You are an expect in Job Hunting and carreer development. You have to help a candidate modify his curriculum for a specific position. Given the following Curriculum, modify it to fit the job description that will be provided after. Here is the curriculum in markdown format:",
        "And here is the job description:",
        "Provide the modified curriculum in markdown format"
    ],// TODO this should not be returned
    userTextFields: [
        { name: "Curriculum Markdown", description: "DescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescr" },
        { name: "Job description", description: "Descr" },

    ], description: "testPrompt", img: ""
}

export class LocalPromptsRepository extends PromptsRepository {
    prompts: InternalPrompt[]
    id: number
    constructor() {
        super()
        this.prompts = [PROMPT]
        this.id = 1
    }
    getPromptById: (id: number) => Prompt | undefined = (id) => {
        console.log("Getpromptsbyid: ")
        console.log(this.prompts)
        return this.prompts.find(p => p.id === id)
    }
    addPrompt: (prompt: Prompt) => void = (prompt) => {
        this.prompts.push({ ...prompt, id: this.id++ })
    }
    findPromptsByKeyword: (keyword: string) => Prompt[] = (keyword) => {
        return this.prompts
    }
    getRecentPrompts: (limit: number) => Prompt[] = (limit) => {
        return this.prompts.slice(0, limit)
    }

}