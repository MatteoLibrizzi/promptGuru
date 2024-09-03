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
                { "role": "user", "content": "write a haiku about ai" }
            ]
        });

        // TODO test this

        console.log(response.choices[0]);
        return ""
    }
}