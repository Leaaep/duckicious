import {Elysia, t} from "elysia";
import {jwtPlugin} from "../util/jwt";
import {createAccount, getAccountByUsername} from "../services/accountService";
import {accountSchema} from "../db/schemas/accountScheme";
import {createInsertSchema} from "drizzle-typebox";

export const AccountInsertSchema = createInsertSchema(accountSchema);

export const authController = new Elysia({prefix: '/auth'})
    .use(jwtPlugin)
    .post('/login', async ({status, body, jwt, cookie: {account}}) => {
        try {
            const accountData = await getAccountByUsername(body.username)
            if (await Bun.password.verify(body.password, accountData.password, 'bcrypt')) {
                const value = await jwt.sign({id: accountData.id, username: accountData.username})
                account.set({
                    value,
                    httpOnly: true,
                    maxAge: 7 * 86400,
                    path: '/',
                    secure: true,
                    sameSite: 'none'
                })
            }
        } catch (e) {
            return status(500, 'Internal Server Error: ' + e?.toString())
        }
    }, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/register', async ({status, body, jwt, cookie: {account}}) => {
        try {
            const usernameTakenCheck = await getAccountByUsername(body.username)
            if (!usernameTakenCheck) {
                body.password = await Bun.password.hash(body.password, 'bcrypt')
                await createAccount(body)
                const accountData = await getAccountByUsername(body.username)
                const value = await jwt.sign({id: accountData.id, email: accountData.username})
                account.set({
                    value,
                    httpOnly: true,
                    maxAge: 7 * 86400,
                    path: '/',
                })
            } else {
                return status(409, 'Conflict username already taken')
            }
        } catch (e) {
            return status(500, 'Internal Server Error: ' + e?.toString())
        }
    }, {
        body: AccountInsertSchema
    })