import express, { Request, Response, NextFunction } from "express"
import { CustomError } from "../structure/errorStructure"
import { pool } from "../index"
import { Record } from "../../types/typing"
import dayjs from "dayjs"
import { RowDataPacket } from "mysql2"

const router = express.Router()

router.get(
  "/",
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const userId = req.query.userId
    const getEntireRecordQuery = `
      SELECT
        *
      FROM
        record
      WHERE
        active = 'Y' AND registered_by = ?
      ORDER BY
        registered_date DESC
      `

    try {
      const [records] = await pool.query<Record[] & RowDataPacket[]>(
        getEntireRecordQuery,
        [userId]
      )

      const formattedDateRecords = records
        .map((record: Record) => ({
          ...record,
          registered_date: dayjs(record.registered_date).format("MM-DD HH:mm"),
        }))
        .reverse()

      return res.status(200).json({
        message: "Successfully retrieved records.",
        data: { records: formattedDateRecords },
      })
    } catch (error) {
      const customError: CustomError = {
        name: "RecordRetrievalError",
        message: "Failed to retrieve records.",
        status: 500,
      }
      return next(customError)
    }
  }
)

export default router
