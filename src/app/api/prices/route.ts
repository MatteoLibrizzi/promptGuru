

const pricesProd = [
    {
        priceId: "price_1PyvGoDZkjJgjhGtNFZiNUxw",
        credits: 390,
        amount: "€ 5.00",
        avgUsages: 3500,
    },
    {
        priceId: "price_1PyvHoDZkjJgjhGtWBVOhfUT",
        credits: 900,
        amount: "€ 10.00",
        avgUsages: 8500,
    },
    {
        priceId: "price_1PyvIIDZkjJgjhGtiZCUhtHU",
        credits: 1900,
        amount: "€ 20.00",
        avgUsages: 19000,
    },
];
const pricesTest = [
    {
        priceId: "price_1PyvrUDZkjJgjhGtL3y2UAZv",
        credits: 3900,
        amount: "€ 50.00",
        avgUsages: 39000,
    },
];
export async function GET(request: Request) {
    if (request.url.includes('dev.prontoprompt.net') || request.url.includes("localhost:3000")) {
        return Response.json(pricesTest)
    }
    return Response.json(pricesProd)
}
