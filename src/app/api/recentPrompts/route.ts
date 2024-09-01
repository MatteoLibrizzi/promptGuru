import { PROMPTS_REPOSITORY } from "../constants";


export async function GET(request: Request) {


    return Response.json({ prompts: PROMPTS_REPOSITORY.getRecentPrompts(200) })
}
