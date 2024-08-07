import {Pool} from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const poolProdDb = new Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB_PRO_DATABASE,
    password: process.env.POSTGRES_DB_PASSWORD,
    port: Number(process.env.POSTGRES_DB_PORT)
})

export default poolProdDb