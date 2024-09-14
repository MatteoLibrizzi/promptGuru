import { DDBPromptsRepository } from "@/app/api/repositories/prompts";

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  const promptsRepository = new DDBPromptsRepository();
  console.log(params.category);

  const prompts = await promptsRepository.getPromptsByCategory(params.category);

  if (prompts.length === 0) {
    return Response.json(
      {
        prompts: [],
      },
      { status: 404 }
    );
  }

  return Response.json({
    prompts,
  });
}
