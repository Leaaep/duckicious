import {pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {InferInsertModel} from "drizzle-orm";

export const accountSchema = pgTable("account", {
    id: serial('id').primaryKey(),
    username: varchar('username', {length: 100}).notNull(),
    password: varchar('password').notNull(),
});

export type Account = InferInsertModel<typeof accountSchema>