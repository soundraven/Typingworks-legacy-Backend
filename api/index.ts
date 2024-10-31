import express from "express"
import cors from "cors"
import mysql, { Pool } from "mysql2/promise"
import dotenv from "dotenv"
import getRandomSentenceRoute from "./typing/sentence"
import getSentenceInfoRoute from "./typing/sentenceInfo"
import getRequestRoute from "./typing/request"
import insertRecordRoute from "./typing/record"
import getKakaoLoginRoute from "./auth/kakaoLogin"
import autoLoginRoute from "./auth/me"
import getRequestListRoute from "./auth/admin"
import confirmRequestRoute from "./auth/confirm"
import getRecentRecordRoute from "./chart/recentRecord"
import getEntireRecordRoute from "./chart/entireRecord"
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

export let pool: Pool

const initApp = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 50,
      queueLimit: 0,
    })

    const connection = await pool.getConnection()
    console.log("Database pool initialized successfully.")
    connection.release()

    app.use("/api/typing/sentence", getRandomSentenceRoute)
    app.use("/api/typing/sentenceInfo", getSentenceInfoRoute)
    app.use("/api/typing/request", getRequestRoute)
    app.use("/api/typing/record", insertRecordRoute)
    app.use("/api/auth/kakaoLogin", getKakaoLoginRoute)
    app.use("/api/auth/me", autoLoginRoute)
    app.use("/api/auth/admin", getRequestListRoute)
    app.use("/api/auth/confirm", confirmRequestRoute)
    app.use("/api/chart/recentRecord", getRecentRecordRoute)
    app.use("/api/chart/entireRecord", getEntireRecordRoute)
    app.use(errorHandlerMiddleware)

    app.listen(process.env.PORT || 8001, () => {
      console.log(`Server is running on port ${process.env.PORT || 8001}.`)
    })
  } catch (error) {
    console.error("Failed to initialize database pool:", error)
    process.exit(1)
  }
}

initApp()

export default app
