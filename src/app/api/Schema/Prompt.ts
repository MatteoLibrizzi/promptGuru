import { UserTextField } from "@/app/api/Model/Prompt";

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

export interface PromptSchema {
    title: string;
    description: string;
    userTextFields: UserTextField[];
    img: string;
    promptTexts: string[];
    id: string
}