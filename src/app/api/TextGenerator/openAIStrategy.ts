import OpenAI from 'openai';
import { TextGenerationOutput, TextGenerationStrategy } from './strategy';
import { PriceProvider } from '../PriceProvider';
import { OpenAIPriceProvider } from '../PriceProvider/openAIPriceProvider';
import { DDBUsersRepository, UsersRepository } from '../repositories/users';

export class OpenAIStrategy extends TextGenerationStrategy {
    private openai: OpenAI;
    priceProvider: PriceProvider;
    usersRepository: UsersRepository;

    constructor(apiKey: string, usersRepository: UsersRepository) {
        super()
        this.openai = new OpenAI({ apiKey });
        this.priceProvider = new OpenAIPriceProvider()
        this.usersRepository = usersRepository
    }


    generate = async (input: string) => {
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