import { TextGenerationStrategy } from './strategy';

export class MockStrategy implements TextGenerationStrategy {
    private stringToReturn: string;

    constructor(stringToReturn: string) {
        this.stringToReturn = stringToReturn
    }

    async generate(input: string): Promise<string> {
        return this.stringToReturn
    }
}