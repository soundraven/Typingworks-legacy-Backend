import { Request, Response, NextFunction } from "express"
import { CustomError } from "../structure/errorStructure"

export const errorHandlerMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack)

  const status = err.status || 500
  const message = err.message || "Internal Server Error"

  const response = {
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // 개발 환경에서만 스택 정보 제공
  }

  res.status(status).json(response)
}
