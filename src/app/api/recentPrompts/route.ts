import { PROMPTS } from "../mockStorage";

export async function GET(request: Request) {

    return Response.json({ prompts: PROMPTS })
}
