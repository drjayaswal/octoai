// NEON                                             |
// import { drizzle } from 'drizzle-orm/neon-http'; |
//                                                  |
// --------------------------------------------------

// SUPABASE
import postgres from "postgres";
import { drizzle } from 'drizzle-orm/postgres-js';


import 'dotenv/config';
const DBURL = process.env.DATABASEURL;
if(!DBURL){
    throw new Error("Database URL is Missing");
}

const client = postgres(DBURL, { 
    prepare: false,
    ssl: "require"
});


export const db =  drizzle(client);