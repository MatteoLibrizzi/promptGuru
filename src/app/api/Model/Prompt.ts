export type UserTextField = { name: string, description: string }

export class PromptModel {
    public title: string;
    public description: string;
    public userTextFields: UserTextField[];
    public img: string;
    public promptTexts: string[];
    public id: number

    constructor(title: string, description: string, userTextFields: UserTextField[], img: string, promptTexts: string[], id: number) {
        this.title = title;
        this.description = description;
        this.userTextFields = userTextFields;
        this.img = img;
        this.promptTexts = promptTexts;
        this.id = id
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
