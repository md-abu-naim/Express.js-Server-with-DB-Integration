import express, { type Application, type Request, type Response } from "express"
import { Pool } from 'pg'
const app: Application = express()
const port = 5000

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_gZdHt93MoSjz@ep-round-field-apl5ob6n.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require'
})


const initDB = async() => {
    try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(20),
                email VARCHAR(20) NOT NULL,
                password VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age INT,

                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
                )
                `)
                console.log('Database connected successfully');  
    } catch (error) {
        console.log(error);
    }
}

initDB()

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        "message": "Express Server",
        "author": "Mohammad Abu Naim"
    })
})

app.post('/post', async (req: Request, res: Response) => {
    const { name, age } = req.body

    res.status(201).json({
        message: "Created Post",
        data: { name, age }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})