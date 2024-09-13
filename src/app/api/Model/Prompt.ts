import { PromptId } from "@/app/api/Repositories/prompts";

export type UserTextField = { name: string, description: string }

export class PromptModel {
    public title: string;
    public description: string;
    public userTextFields: UserTextField[];
    public img: string;
    public promptTexts: string[];
    public categories: string[]
    public id: PromptId

    constructor(title: string, description: string, userTextFields: UserTextField[], img: string, promptTexts: string[], categories: string[], id: PromptId) {
        this.title = title;
        this.description = description;
        this.userTextFields = userTextFields;
        this.img = img;
        this.promptTexts = promptTexts;
        this.id = id
        this.categories = categories
    }

    getFilledPrompt = (userText: string[]) => {
        let acc = ""
        // TODO verify lengths

        for (let i = 0; i < this.promptTexts.length; i++) {
            acc = acc.concat(this.promptTexts[i])

            if (i < userText.length) {
                acc = acc.concat(userText[i])
            }
        }
        return acc
    }
}
