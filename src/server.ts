import express, { type Application, type Request, type Response } from "express"
import { Pool } from 'pg'
import config from "./config"
const app: Application = express()
const port = 5000

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
    connectionString: config.connection_string
})


const initDB = async () => {
    try {
        await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(20),
                email VARCHAR(20) UNIQUE NOT NULL,
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

app.get('/api/', (req: Request, res: Response) => {
    res.status(200).json({
        "message": "Express Server",
        "author": "Mohammad Abu Naim"
    })
})

app.post('/api/users', async (req: Request, res: Response) => {
    try {
        const { name, age, email, password } = req.body

        const result = await pool.query(`
        INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *
        `, [name, email, password, age])


        res.status(201).json({
            message: "Created Post",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})

app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users
            `)

        res.status(200).json({
            success: true,
            message: "Users retrived successfully",
            data: result.rows,
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})

app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await pool.query(`
            SELECT * FROM users WHERE id=$1
            `, [id])

        if (result.rows?.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            })
        }

        res.status(200).json({
            success: true,
            message: "User retrived successfully",
            data: result.rows[0],
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})


app.put('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name, password, is_active } = req.body
        const result = await pool.query(`
            UPDATE users SET
             name=COALESCE($1, name),
              password=COALESCE($2, password),
               is_active=COALESCE($3, is_active)

             WHERE id=$4 RETURNING *
            `, [name, password, is_active, id])

        if (result.rows?.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            })
        }

        res.status(200).json({
            success: true,
            message: "User update successfully",
            data: result.rows[0],
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})

app.delete('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await pool.query(`
            DELETE FROM users WHERE id=$1
            `, [id])

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            })
        }

        res.status(200).json({
            success: true,
            message: "User delete successfully",
            data: result.rows[0],
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})

app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`)
})