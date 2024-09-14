import { PriceProvider } from "../PriceProvider";
import { UsersRepository } from "../repositories/users";

export interface TextGenerationOutput {
    output: string
    price: number
}

export abstract class TextGenerationStrategy {

    abstract priceProvider: PriceProvider
    abstract usersRepository: UsersRepository
    abstract generate: (input: string, userId: string, promptId: string) => Promise<TextGenerationOutput>;
}