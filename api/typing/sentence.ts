import express, { Request, Response, NextFunction } from "express"
import { CustomError } from "../structure/errorStructure"
import { pool } from "../index"

const router = express.Router()

router.get(
  "/",
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { oneCycle, language, type } = req.query
    const oneCycleNum = Number(oneCycle)

    console.log(oneCycleNum)

    if (isNaN(oneCycleNum) || oneCycleNum <= 0) {
      const error: CustomError = {
        name: "InvalidParameterError",
        message: "Invalid 'oneCycle' parameter. It must be a positive number.",
        status: 400,
      }
      return next(error)
    }

    let params: any[] = []

    let getSentenceQuery = `
    SELECT
      *
    FROM
      sentence
    WHERE
      active = 'Y'
      ${language ? `AND language = ?` : `AND language = 'kr'`}
      ${type ? `AND type = ?` : ""}
    ORDER BY
      RAND()
    LIMIT ?`

    if (language) params.push(language)
    if (type) params.push(type)
    if (oneCycleNum) params.push(oneCycleNum)

    try {
      const [sentences] = await pool.query(getSentenceQuery, [...params])

      return res.status(200).json({
        success: true,
        message: "Successfully retrieved sentences.",
        data: sentences,
      })
    } catch (error) {
      const customError: CustomError = {
        name: "SentenceRetrievalError",
        message: "Failed to retrieve sentences.",
        status: 500,
      }
      return next(customError)
    }
  }
)

export default router
