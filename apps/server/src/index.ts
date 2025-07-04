import {Elysia} from "elysia";
import {dbConnect} from "./db/db";
import cors from "@elysiajs/cors";
import {authController} from "./controllers/authController";
import {recipeController} from "./controllers/recipeController";

dbConnect()

const app = new Elysia({ prefix: '/api' })
    .use(authController)
    .use(recipeController)
    .use(cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    }))
    .listen(4000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);