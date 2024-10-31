import express, { Request, Response, NextFunction } from "express"
import { pool } from "../index"
import { CustomError } from "../../types/errorStructure"

const router = express.Router()

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [languageInfo, typeInfo] = await Promise.all([
      pool.query(`SELECT * FROM language`),
      pool.query(`SELECT * FROM type`),
    ])

    return res.status(200).json({
      success: true,
      message: "Successfully got languages.",
      data: { languageInfo: languageInfo[0], typeInfo: typeInfo[0] },
    })
  } catch (error) {
    const customError = new CustomError("Failed to retrieve sentences.", 500)
    return next(customError)
  }
})

export default router
