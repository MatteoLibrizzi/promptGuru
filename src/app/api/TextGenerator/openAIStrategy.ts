import OpenAI from 'openai';
import { TextGenerationOutput, TextGenerationStrategy } from './strategy';

export class OpenAIStrategy implements TextGenerationStrategy {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    async generate(input: string): Promise<TextGenerationOutput> {
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o-mini-2024-07-18",
            messages: [
                { "role": "user", "content": input }
            ]
        });

        const openAiGeneratedContent = response.choices[0]?.message?.content
        if (!openAiGeneratedContent) {
            throw new Error("No valid response from OpenAI")
        }
        const escapedReturnValue = openAiGeneratedContent.replace(/\n/g, "\n");

        return { output: escapedReturnValue, price: 0 }
    }
}