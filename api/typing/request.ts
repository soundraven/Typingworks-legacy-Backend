import express, { Request, Response, NextFunction } from "express"
import { CustomError } from "../structure/errorStructure"
import { pool } from "../index"
import { RuleForm } from "../../types/typing"

const router = express.Router()

router.get(
  "/",
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    console.log("요청 수락")
    const form: RuleForm = req.body.form
    form.language === "Korean" ? (form.language = "kr") : (form.language = "En")
    form.sentenceType === "Quote"
      ? (form.sentenceType = "quote")
      : (form.sentenceType = "pangram")

    const insertFormQuery = `
    INSERT INTO request (
      name,
      language,
      type,
      other_type,
      comment,
      source,
      sentence,
      explanation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
`

    const values = [
      form.name,
      form.language,
      form.sentenceType,
      form.otherSentenceType,
      form.comment || null,
      form.source,
      form.sentence,
      form.explanation || null,
    ]

    try {
      const [result] = await pool.query(insertFormQuery, [...values])
      console.log(result)

      const success: Boolean = true
      return res.status(200).json({
        message: "Successfully retrieved sentences.",
        data: success,
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
