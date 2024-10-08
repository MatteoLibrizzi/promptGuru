import { TextGenerationOutput, TextGenerationStrategy } from "@/app/api/TextGenerator/strategy";

export class TextGenerator {
    private strategy: TextGenerationStrategy;

    constructor(strategy: TextGenerationStrategy) {
        this.strategy = strategy;
    }

    async generate(input: string, userId: string, promptId: string): Promise<TextGenerationOutput> {
        return this.strategy.generate(input, userId, promptId);
    }
}