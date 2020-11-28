import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import crawlerRoutes from './routes/crawler.js'
dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APIRoot = process.env.API_ROOT
const app = express()
const liveProbes = {}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())
// app.use(express.static(path.join(path.resolve(path.dirname('')), 'public')))
console.log(path.join(__dirname,'public'))
app.use(express.static(path.join(__dirname,'public')))
app.use(`${APIRoot}/crawler`,crawlerRoutes)
app.get('/test', (req, res) => {
  res.send({ test: 1 })
})

app.listen(22222, () => {
  console.log('Server is listening on port 22222')
})

export default app
