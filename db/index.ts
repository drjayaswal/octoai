import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';

const DBURL = process.env.DATABASEURL;
if(!DBURL){
    throw new Error("Database URL is Missing");
}
export const db =  drizzle(DBURL);