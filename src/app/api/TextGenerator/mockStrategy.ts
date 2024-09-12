import { TextGenerationOutput, TextGenerationStrategy } from './strategy';

export class MockStrategy implements TextGenerationStrategy {
    private stringToReturn: string;

    constructor(stringToReturn: string) {
        this.stringToReturn = stringToReturn
    }

    async generate(input: string): Promise<TextGenerationOutput> {
        return { output: this.stringToReturn, price: 1 }
    }
}