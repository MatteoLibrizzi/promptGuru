import { PriceProvider } from "@/app/api/TextGeneratorPriceProvider"

export class OpenAIPriceProvider extends PriceProvider {
    pricePerInputToken = 0.000075 / 1000
    pricePerOutputToken = 0.000300 / 1000
    getPriceForInputTokens: (numberOfInputTokens: number) => number = (numberOfInputTokens) => {
        return (this.pricePerInputToken * 3) * numberOfInputTokens
    }
    getPriceForOutputTokens: (numberOfOutputTokens: number) => number = (numberOfOutputTokens) => {
        return this.pricePerInputToken * 3 * numberOfOutputTokens
    }
}
