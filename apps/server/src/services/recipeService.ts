import {db} from "../db/db";
import {eq} from "drizzle-orm/sql/expressions/conditions";
import {Recipe, recipeSchema} from "../db/schemas/recipeScheme";

export const getRecipes = async () => {
    return db.select().from(recipeSchema);
}

export const getRecipe = async (recipeID: number) => {
    return db.select().from(recipeSchema).limit(1)
        .where(eq(recipeSchema.id, recipeID));
}

export const updateRecipe = async (recipe: Recipe) => {
    if (recipe.id) {
        return db.update(recipeSchema)
            .set(recipe)
            .where(eq(recipeSchema.id, recipe.id))
    } else {
        throw new Error('ID Required for update!')
    }
}

export const createRecipe = async (recipe: Recipe) => {
    return db.insert(recipeSchema).values(recipe);
}

export const deleteRecipe = (recipeID: number) => {
    return db.delete(recipeSchema).where(eq(recipeSchema.id, recipeID))
}