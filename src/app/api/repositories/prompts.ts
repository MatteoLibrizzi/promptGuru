import { PromptModel, InternalPrompt } from "../Model/Prompt"


export abstract class PromptsRepository {
    abstract getPromptById: (id: number) => PromptModel | undefined
    abstract addPrompt: (prompt: PromptModel) => void
    abstract findPromptsByKeyword: (keyword: string) => PromptModel[]
    abstract getRecentPrompts: (limit: number) => PromptModel[]
}

const PROMPT = new InternalPrompt(
    "CV Updater", "testPrompt",
    [
        { name: "Curriculum Markdown", description: "DescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescr" },
        { name: "Job description", description: "Descr" },

    ], "",
    [
        "You are an expect in Job Hunting and carreer development. You have to help a candidate modify his curriculum for a specific position. Given the following Curriculum, modify it to fit the job description that will be provided after. Here is the curriculum in markdown format:\n",
        "\nAnd here is the job description:\n",
        "\nProvide the modified curriculum in markdown format"
    ]
)

export class LocalPromptsRepository extends PromptsRepository {
    prompts: InternalPrompt[]
    id: number
    constructor() {
        super()
        this.prompts = [PROMPT]
        this.id = 1
    }
    getPromptById: (id: number) => PromptModel | undefined = (id) => {
        return this.prompts.find(p => p.id === id)
    }
    addPrompt: (prompt: PromptModel) => void = (prompt) => {
        this.prompts.push({ ...prompt, id: this.id++ })
    }
    findPromptsByKeyword: (keyword: string) => PromptModel[] = (keyword) => {
        return this.prompts
    }
    getRecentPrompts: (limit: number) => PromptModel[] = (limit) => {
        return this.prompts.slice(0, limit)
    }

}