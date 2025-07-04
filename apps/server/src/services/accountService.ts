import {eq} from "drizzle-orm/sql/expressions/conditions";
import {Account, accountSchema} from "../db/schemas/accountScheme";
import {db} from "../db/db";


export const getAccount = async (id: number) => {
    const data = await db.select().from(accountSchema)
        .where(eq(accountSchema.id, id));
    return data[0]
}

export const getAccountByUsername = async (username: string) => {
    const data = await db.select().from(accountSchema)
        .where(eq(accountSchema.username, username));
    return data[0]
}

export const updateAccount = async (account: Account) => {
    if (account.id) {
        return db.update(accountSchema)
            .set(account)
            .where(eq(accountSchema.id, account.id))
    } else {
        throw new Error('ID Required for update!')
    }
}

export const createAccount = async (account: Account) => {
    return db.insert(accountSchema).values(account)
}

export const deleteAccount = (id: number) => {
    return db.delete(accountSchema).where(eq(accountSchema.id, id))
}