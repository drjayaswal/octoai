import "server-only"

import { StreamClient } from "@stream-io/node-sdk"
import "dotenv/config"

const KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY
const SECRET = process.env.NEXT_PUBLIC_STREAM_API_SECRET

if (!KEY || !SECRET) {
    throw new Error("Stream Credentials is missing")
}

export const streamVideo = new StreamClient(KEY,SECRET)