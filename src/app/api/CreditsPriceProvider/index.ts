
const priceIdToPrice: Record<string, any> = {
    "price_1PyvGoDZkjJgjhGtNFZiNUxw": {
        amount: 500,
        credits: 390
    },
    "price_1PyvHoDZkjJgjhGtWBVOhfUT": {
        amount: 1000,
        credits: 900
    },
    "price_1PyvIIDZkjJgjhGtiZCUhtHU": {
        amount: 2000,
        credits: 1900
    },
    "price_1PyvrUDZkjJgjhGtL3y2UAZv": {
        amount: 200,
        credits: 200
    }
}
export class CreditsPriceProvider {

    static priceIdToAmount = (priceId: string) => {

        const amount = priceIdToPrice[priceId].amount

        if (!amount) {
            throw new Error("Invalid price ID")
        }

        return amount
    }

    static priceIdToCredits = (priceId: string) => {

        const credits = priceIdToPrice[priceId].credits

        if (!credits) {
            throw new Error("Invalid price ID")
        }

        return credits
    }

    static doesPriceIdExist = (priceId: string) => Object.keys(priceIdToPrice).includes(priceId)
}