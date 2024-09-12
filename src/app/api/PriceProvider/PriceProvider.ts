export abstract class PriceProvider {

    abstract getPriceForInputTokens: (numberOfInputTokens: number) => number
    abstract getPriceForOutputTokens: (numberOfOutputTokens: number) => number

}