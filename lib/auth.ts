import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {db} from "@/db";
import * as schema from "@/db/schema"

const ID = process.env.GITHUB_CLIENT_ID
const SECRET = process.env.GITHUB_CLIENT_SECRET

if(!ID || !SECRET){
    throw new Error("Social ID/Secret is missing")
}

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: { 
            clientId: ID as string, 
            clientSecret: SECRET as string, 
        }, 
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
        }
    }),
});