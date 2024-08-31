export async function POST(request: Request, { params }: { params: { id: string } }) {
    console.log(request)
    console.log(params)
    // TODO Implement use (with auth)
    return Response.json({})
}
