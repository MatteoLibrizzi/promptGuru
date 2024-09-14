import { PriceProvider } from '../TextGeneratorPriceProvider';
import { UsersRepository } from '../repositories/users';
import { TextGenerationStrategy } from './strategy';

export class MockStrategy extends TextGenerationStrategy {
    private stringToReturn: string;
    priceProvider: PriceProvider
    usersRepository: UsersRepository;


    constructor(stringToReturn: string, usersRepository: UsersRepository) {
        super()
        this.stringToReturn = stringToReturn
        this.priceProvider = new MockPriceProvider()
        this.usersRepository = usersRepository
    }

    generate = async (input: string, userId: string, promptId: string) => {
        const inputTokensCount = input.length
        const priceInput = this.priceProvider.getPriceForInputTokens(inputTokensCount)

        if (priceInput > await this.usersRepository.getUserBalance(userId)) {
            throw new Error("Not enough credits")
        }

        // GENERATE STRING

        const outputTokensCount = this.stringToReturn.length
        const priceOutput = this.priceProvider.getPriceForOutputTokens(outputTokensCount)

        const totalPrice = priceInput + priceOutput

        this.usersRepository.addTransaction(userId, {
            promptId,
            transactionTimestamp: Date.now(),
            amount: -totalPrice,
            description: "Text Generation"
        })

        return { output: this.stringToReturn, price: totalPrice }
    }
}

export class MockPriceProvider extends PriceProvider {
    pricePerInputToken = 0.000075 / 1000
    pricePerOutputToken = 0.000300 / 1000
    getPriceForInputTokens: (numberOfInputTokens: number) => number = (numberOfInputTokens) => {
        return this.pricePerInputToken * numberOfInputTokens
    }
    getPriceForOutputTokens: (numberOfOutputTokens: number) => number = (numberOfOutputTokens) => {
        return this.pricePerOutputToken * numberOfOutputTokens
    }
}
