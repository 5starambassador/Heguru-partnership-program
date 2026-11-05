import { Client } from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

async function run() {
    const connectionString = process.env.DATABASE_URL
    console.log("Connecting using pg client to:", connectionString?.split('@')[1])

    const client = new Client({ connectionString })
    const startConnect = Date.now()
    await client.connect()
    console.log(`pg client connect took: ${Date.now() - startConnect}ms`)

    for (let i = 0; i < 5; i++) {
        const start = Date.now()
        const res = await client.query('SELECT 1')
        console.log(`[Query ${i+1}] SELECT 1 took: ${Date.now() - start}ms`)
    }

    await client.end()
}

run().catch(console.error)
