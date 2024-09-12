export interface TextGenerationOutput {
    output: string
    price: number
}

export interface TextGenerationStrategy {
    generate(input: string): Promise<TextGenerationOutput>;
}