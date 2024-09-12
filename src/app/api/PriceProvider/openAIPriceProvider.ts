import { PriceProvider } from "./PriceProvider"

export class OpenAIPriceProvider extends PriceProvider {
    pricePerInputToken = 0.000075 / 1000
    pricePerOutputToken = 0.000300 / 1000
    getPriceForInputTokens: (numberOfInputTokens: number) => number = (numberOfInputTokens) => {
        return this.pricePerInputToken * numberOfInputTokens
    }
    getPriceForOutputTokens: (numberOfOutputTokens: number) => number = (numberOfOutputTokens) => {
        return this.pricePerOutputToken * numberOfOutputTokens
    }

}