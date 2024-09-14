import OpenAI from 'openai';
import { TextGenerationStrategy } from './strategy';
import { PriceProvider } from '../TextGeneratorPriceProvider';
import { OpenAIPriceProvider } from '../TextGeneratorPriceProvider/openAIPriceProvider';
import { UsersRepository } from '../repositories/users';

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


    generate = async (input: string, userId: string, promptId: string) => {
        const inputTokensCount = input.length
        const priceInput = this.priceProvider.getPriceForInputTokens(inputTokensCount)
        if (priceInput > await this.usersRepository.getUserBalance(userId)) {
            throw new Error("Not enough credits")
        }


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


        const outputTokensCount = openAiGeneratedContent.length
        const priceOutput = this.priceProvider.getPriceForOutputTokens(outputTokensCount)

        const totalPrice = priceInput + priceOutput

        this.usersRepository.addTransaction(userId, {
            promptId,
            transactionTimestamp: Date.now(),
            amount: -totalPrice,
            description: "Text Generation"
        })

        const escapedReturnValue = openAiGeneratedContent.replace(/\n/g, "\n");

        return { output: escapedReturnValue, price: totalPrice }
    }
}