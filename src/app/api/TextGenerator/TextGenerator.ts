import { TextGenerationStrategy } from "./strategy";

export class TextGenerator {
    private strategy: TextGenerationStrategy;

    constructor(strategy: TextGenerationStrategy) {
        this.strategy = strategy;
    }

    async generate(input: string): Promise<string> {
        return this.strategy.generate(input);
    }
}