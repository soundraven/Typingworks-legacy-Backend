import express, { Request, Response, NextFunction } from "express"
import { CustomError } from "../../types/errorStructure"
import { pool } from "../index"
import { ResultSetHeader } from "mysql2"

const router = express.Router()

router.post(
  "/",
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { status, requestId } = req.body
    const deactiveQuery = `UPDATE request SET active = 'N' WHERE id = ?`
    const confirmQuery = `UPDATE request SET confirm = ? WHERE id = ?`
    const insertSentenceQuery = `
      INSERT INTO sentence (type, language, content, source)
      SELECT type, language, sentence, source
      FROM request
      WHERE id = ?
    `

    try {
      const [result] = await pool.query<ResultSetHeader>(deactiveQuery, [
        requestId,
      ])
      if (result.affectedRows === 1) {
        const [result] = await pool.query<ResultSetHeader>(confirmQuery, [
          `${status === "accept" ? "Y" : "N"}`,
          requestId,
        ])
        if (result.affectedRows === 1 && status === "accept") {
          const [result] = await pool.query<ResultSetHeader>(
            insertSentenceQuery,
            [requestId]
          )
          if (result.affectedRows === 1) {
            const success: Boolean = true
            return res.status(200).json({
              message: "Request successfully confirmed.",
              data: success,
            })
          } else {
            throw new Error("Request confirm failed")
          }
        } else if (result.affectedRows === 1) {
          return res.status(200).json({
            message: "Request successfully confirmed.",
            data: { success: true },
          })
        } else {
          throw new Error("Request confirm failed")
        }
      } else {
        throw new Error("Request confirm failed")
      }
    } catch (error) {
      const customError = new CustomError("Failed to confirm request.", 500)
      return next(customError)
    }
  }
)

export default router
