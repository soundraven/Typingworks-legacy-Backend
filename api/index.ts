import express from "express"
import cors from "cors"
import mysql, { Pool } from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const startServer = () => {
  app.listen(process.env.PORT || 8001, () => {
    console.log(`Server is running on port ${process.env.PORT || 8001}`)
  })
}

export let pool: Pool | null = null

async function connectToDatabase() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectionLimit: 50,
    })

    const connection = await pool.getConnection()
    console.log("Connected to MySQL database")
    connection.release()
  } catch (error) {
    console.error("Failed to connect to MySQL. Retrying in 5 seconds...", error)
    setTimeout(connectToDatabase, 5000)
  }
}

startServer()
connectToDatabase()

export default app
