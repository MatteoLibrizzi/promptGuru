export interface TextGenerationStrategy {
    generate(input: string): Promise<string>;
}