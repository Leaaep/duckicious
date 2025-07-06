import {Elysia, t} from "elysia";
import {createRecipe, deleteRecipe, getRecipe, getRecipes, updateRecipe} from "../services/recipeService";
import {createInsertSchema} from "drizzle-typebox";
import {recipeSchema} from "../db/schemas/recipeScheme";
import {jwtPlugin} from "../util/jwt";

const RecipeInsertSchema = createInsertSchema(recipeSchema)

export const recipeController = new Elysia({prefix: '/recipe'})
    .use(jwtPlugin)
    .get('/', async ({status}) => {

        try {
            return getRecipes();
        } catch (e) {
            return status(500, 'Internal Server Error: ' + e?.toString())
        }
    }, {
        async beforeHandle({cookie: {account}, status, jwt}) {
            const accountData = await jwt.verify(account.value)
            if (!accountData) {
                return status(401, 'Unauthorized')
            }
        }
    })
    .get('/:recipeID', async ({status, params: {recipeID}}) => {
        try {
            const recipe = await getRecipe(recipeID)
            return recipe[0]
        } catch (e) {
            return status(500, 'Internal Server Error: ' + e?.toString())
        }
    }, {
        params: t.Object({
            recipeID: t.Number()
        }),
        async beforeHandle({cookie: {account}, status, jwt}) {
            const accountData = await jwt.verify(account.value)
            if (!accountData) {
                return status(401, 'Unauthorized')
            }
        }
    })
    .post('/', async ({status, body}) => {
        try {
            createRecipe(body)
            return status(201, 'Recipe created successfully')
        } catch (e) {
            return status(500, 'Internal Server Error: ' + e?.toString())
        }
    }, {
        body: RecipeInsertSchema,
        async beforeHandle({cookie: {account}, status, jwt}) {
            const accountData = await jwt.verify(account.value)
            if (!accountData) {
                return status(401, 'Unauthorized')
            }
        }
    })
    .put('/:recipeID', ({status, body}) => {
        try {
            updateRecipe(body)
            return status(200, 'Recipe updated successfully')
        } catch (e) {
            return status(500, 'Internal Server Error: ' + e?.toString())
        }
    }, {
        body: RecipeInsertSchema,
        async beforeHandle({cookie: {account}, status, jwt}) {
            const accountData = await jwt.verify(account.value)
            if (!accountData) {
                return status(401, 'Unauthorized')
            }
        }
    })
    .delete('/:recipeID', async ({status, params: {recipeID}}) => {
        try {
            await deleteRecipe(recipeID)
            return status(200, 'Recipe deleted successfully')
        } catch (e) {
            return status(500, 'Internal Server Error: ' + e?.toString())
        }
    }, {
        params: t.Object({
            recipeID: t.Number()
        }),
        async beforeHandle({cookie: {account}, status, jwt}) {
            const accountData = await jwt.verify(account.value)
            if (!accountData) {
                return status(401, 'Unauthorized')
            }
        }
    })
    .get('/import', async ({query: {url}, status}) => {
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/extract?apiKey=${Bun.env.SPOONACULAR_API_KEY}&url=${url}`, {
                    method: 'GET',
                }
            )

            if (!response.ok) {
                return status(500, 'Internal Server Error: ' + response.status + ' ' + response.statusText)
            }
            const data = await response.json()

            const ingredients = data.extendedIngredients.map((recipe: any) => recipe.originalName)

            const body = {
                title: data.title,
                description: data.summary,
                ingredients: ingredients,
                instructions: data.instructions,
                servings: data.servings,
                cookTime: data.readyInMinutes
            }

            await createRecipe(body)
        } catch (e) {
            return status(500, 'Internal Server Error: ' + e?.toString())
        }
    }, {
        query: t.Object({
            url: t.String()
        }),
        async beforeHandle({cookie: {account}, status, jwt}) {
            const accountData = await jwt.verify(account.value)
            if (!accountData) {
                return status(401, 'Unauthorized')
            }
        }
    })