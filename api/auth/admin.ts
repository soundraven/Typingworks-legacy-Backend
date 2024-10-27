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
    const getRequestQuery = `SELECT * FROM request WHERE active = 'Y' ORDER BY id DESC`

    try {
      const [request] = await pool.query(getRequestQuery)

      return res.status(200).json({
        message: "Successfully retrieved sentences.",
        data: { requestList: request },
      })
    } catch (error) {
      const customError: CustomError = {
        name: "RequestRetrievalError",
        message: "Failed to retrieve requests.",
        status: 500,
      }
      return next(customError)
    }
  }
)

export default router
