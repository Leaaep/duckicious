import {pgTable} from "drizzle-orm/pg-core/table";
import {customType, integer, serial, varchar} from "drizzle-orm/pg-core";
import {InferInsertModel} from "drizzle-orm";
import {seasons} from "./seasons";

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
    dataType() {
        return "bytea";
    },
});

export const recipeSchema = pgTable('recipe', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 80 }).notNull(),
    description: varchar('description'),
    image: bytea(),
    ingredients: varchar('ingredients').array().notNull(),
    instructions: varchar('instructions').notNull(),
    season: seasons('season').default('spring').notNull(),
    servings: integer('servings').notNull(),
    cookTime: integer('cookTime').notNull(),
})

export type Recipe = InferInsertModel<typeof recipeSchema>