import { Request, Response, NextFunction } from "express"
import { CustomError } from "../../types/errorStructure"

export const errorHandlerMiddleware = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack)

  const status = (err as CustomError).status || 500
  const message = (err as CustomError).message || "Internal Server Error"

  const response: {
    status: string
    message: string
  } = {
    status: "error",
    message,
  }

  res.status(status).json(response)
}
