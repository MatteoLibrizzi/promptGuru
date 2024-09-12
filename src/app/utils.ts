import { FREE_CREDITS_CENTS } from "./api/constants"
import { DDBUsersRepository } from "./api/Repositories/users"

export const createUserIfNotExistent = async (userId: string) => {

    const usersRepositories = new DDBUsersRepository()

    const isExistingUser = await usersRepositories.isExistingUser(userId)
    if (!isExistingUser) {
        await usersRepositories.createNewUser({ userId: userId, credits: FREE_CREDITS_CENTS })
    }
}

export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
