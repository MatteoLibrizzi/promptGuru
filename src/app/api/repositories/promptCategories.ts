
export abstract class PromptCategoriesRepository {

    abstract getCategories: () => Promise<string[]>
    abstract getSubcategories: (category: string) => Promise<string[]>
    abstract getAllSubcategories: () => Promise<Record<string, string[]>>
}

export class HardcodedPromptCategoriesRepository extends PromptCategoriesRepository {
    categories: Record<string, string[]> = {
        "Productivity": ["Job Search"],
        "Creative Writing": ["Poems", "Novels"],
        "Conversation": ["Inspiring Conversations", "Science"],
        "Funny": ["Memes"],
        "Movies": ["Fact checking", "Movie Summaries"]
    }

    getCategories: () => Promise<string[]> = async () => {
        return Object.keys(this.categories)
    }
    getSubcategories: (category: string) => Promise<string[]> = async (category) => {
        const lookedUpSubcategories = this.categories[category]

        if (!lookedUpSubcategories) {
            return []
        }
        return lookedUpSubcategories
    }
    getAllSubcategories: () => Promise<Record<string, string[]>> = async () => {
        return this.categories
    }

}