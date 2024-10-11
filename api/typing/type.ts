import express, { Request, Response, NextFunction } from "express"
import { pool } from "../index"

const router = express.Router()

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [result] = await pool.query(`SELECT * FROM type`)
    return res.status(200).json({
      success: true,
      message: "Successfully got types.",
      data: result,
    })
  } catch (error) {
    next(error)
  }
})

export default router
