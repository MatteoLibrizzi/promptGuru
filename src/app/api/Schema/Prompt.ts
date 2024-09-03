import { UserTextField } from "../Model/Prompt";

export interface AddPromptSchema {
    title: string;
    description: string;
    userTextFields: UserTextField[];
    img: string;
    promptTexts: string[];
}

export interface UsePromptSchema {
    userTexts: string[]
}