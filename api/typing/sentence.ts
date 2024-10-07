import express, { Request, Response, NextFunction } from "express"
import { getRandomTypeSentence } from "../service/typingService"
import { CustomError } from "../structure/errorStructure"

const router = express.Router()

router.get(
  "/",
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const oneCycle = parseInt(req.query.oneCycle as string, 10)

    if (isNaN(oneCycle) || oneCycle <= 0) {
      const error: CustomError = new Error(
        "Invalid 'oneCycle' parameter. It must be a positive number."
      )
      error.status = 400
      return next(error)
    }

    try {
      const sentences = await getRandomTypeSentence(oneCycle)
      return res.status(200).json({
        success: true,
        message: "Successfully retrieved sentences.",
        data: sentences,
      })
    } catch (error) {
      return next(error)
    }
  }
)

export default router
