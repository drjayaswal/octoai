import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const DBURL = process.env.DATABASEURL;
if(!DBURL){
    throw new Error("Database URL is Missing");
}

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: DBURL,
  },
});
