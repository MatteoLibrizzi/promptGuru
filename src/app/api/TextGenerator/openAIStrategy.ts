import OpenAI from 'openai';
import { TextGenerationStrategy } from './strategy';

export class OpenAIStrategy implements TextGenerationStrategy {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    async generate(input: string): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { "role": "user", "content": input }
            ]
        });

        // TODO test this

        console.log(JSON.stringify(response));
        const openAiGeneratedContent = response.choices[0]?.message?.content
        if (!openAiGeneratedContent) {
            throw new Error("No valid response from OpenAI")
        }
        const escapedReturnValue = openAiGeneratedContent.replace(/\n/g, "\n");

        console.log(escapedReturnValue)
        return escapedReturnValue
    }
}