import express, { type Application, type Request, type Response } from "express"
const app: Application = express()
const port = 5000

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        "message": "Express Server",
        "author": "Mohammad Abu Naim"
    })
}) 

app.post('/post', async(req: Request, res: Response) => {
    console.log(req);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})