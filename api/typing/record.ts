import express, { Request, Response, NextFunction } from "express"
import { CustomError } from "../structure/errorStructure"
import { pool } from "../index"
import { TypingInfo } from "../../types/typing"
import { ResultSetHeader } from "mysql2"

const router = express.Router()

router.post(
  "/",
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const typingInfo: TypingInfo = req.body.typingInfo
    const userId: number = Number(req.body.userId)

    const insertTypingInfoQuery = `
    INSERT INTO record (
      registered_by,
      language,
      type,
      avg_wpm,
      avg_cpm,
      max_wpm,
      max_cpm,
      avg_accuracy,
      avg_progress,
      count,
      time,
      char_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`

    const values = [
      userId,
      typingInfo.targetLanguage,
      typingInfo.targetSentenceType,
      typingInfo.avgWpm,
      typingInfo.avgCpm,
      typingInfo.maxWpm,
      typingInfo.maxCpm,
      typingInfo.avgAccuracy,
      typingInfo.avgProgress,
      typingInfo.count,
      typingInfo.entireElapsedTime,
      typingInfo.charCount,
    ]

    try {
      const [result] = await pool.query<ResultSetHeader>(
        insertTypingInfoQuery,
        [...values]
      )

      if (result.affectedRows === 1) {
        return res.status(200).json({
          message: "Successfully inserted form data.",
          data: { success: true },
        })
      } else {
        throw new Error("Record insertion failed")
      }
    } catch (error) {
      const customError: CustomError = {
        name: "RecordInsertionError",
        message: "Failed to insert Record.",
        status: 500,
      }
      return next(customError)
    }
  }
)

export default router
