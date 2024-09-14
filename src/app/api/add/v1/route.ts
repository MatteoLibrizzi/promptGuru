
import { DDBPromptsRepository } from "@/app/api/repositories/prompts";
import { DDBUsersRepository } from "@/app/api/repositories/users";
import handler from "./handler";


export async function POST(request: Request) {
    const usersRepository = new DDBUsersRepository()
    const promptsRepository = new DDBPromptsRepository()

    return await handler(request, usersRepository, promptsRepository)
}
