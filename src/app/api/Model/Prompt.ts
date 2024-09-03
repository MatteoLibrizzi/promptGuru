export type UserTextField = { name: string, description: string }

export class PromptModel {
    title: string;
    description: string;
    userTextFields: UserTextField[];
    img: string;
    promptTexts: string[];

    constructor(title: string, description: string, userTextFields: UserTextField[], img: string, promptTexts: string[]) {
        this.title = title;
        this.description = description;
        this.userTextFields = userTextFields;
        this.img = img;
        this.promptTexts = promptTexts;
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

export class InternalPrompt extends PromptModel {
    id: number;

    static currentId = 0

    constructor(title: string, description: string, userTextFields: UserTextField[], img: string, promptTexts: string[]) {
        super(title, description, userTextFields, img, promptTexts);
        this.id = InternalPrompt.currentId++;
    }
}
