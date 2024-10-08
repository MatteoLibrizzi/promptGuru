
import { DDBPromptsRepository } from "@/app/api/repositories/prompts";
import { DDBUsersRepository } from "@/app/api/repositories/users";
import handler from "./handler";
import { S3ImageHostingRepository } from "../../repositories/imageHosting";


export async function POST(request: Request) {
    const usersRepository = new DDBUsersRepository()
    const promptsRepository = new DDBPromptsRepository()
    const imageHostingRepository = new S3ImageHostingRepository()

    return await handler(request, usersRepository, promptsRepository, imageHostingRepository)
}
