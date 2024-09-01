import { PROMPTS_REPOSITORY } from "../../constants"


export async function GET(request: Request, { params }: { params: { keyword: string } }) {



    return Response.json({ prompts: PROMPTS_REPOSITORY.findPromptsByKeyword(params.keyword) })
}
