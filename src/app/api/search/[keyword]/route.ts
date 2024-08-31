import { PROMPTS } from "../../mockStorage"

export async function GET(request: Request, { params }: { params: { keyword: string } }) {
    // TODO implement search
    return Response.json({ prompts: PROMPTS })
}
