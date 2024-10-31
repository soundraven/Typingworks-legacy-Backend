import express, { Request, Response, NextFunction } from "express"
import { CustomError } from "../../types/errorStructure"
import { pool } from "../index"
import { RuleForm } from "../../types/typing"
import { ResultSetHeader } from "mysql2"

const router = express.Router()

router.post(
  "/",
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const form: RuleForm = req.body.form
    form.language === "Korean" ? (form.language = "kr") : (form.language = "En")
    if (form.sentenceType !== "") {
      form.sentenceType === "Quote"
        ? (form.sentenceType = "quote")
        : (form.sentenceType = "pangram")
    }

    const insertFormQuery = `
    INSERT INTO request (
      requester,
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
      form.requester,
      form.language,
      form.sentenceType || null,
      form.otherSentenceType,
      form.comment || null,
      form.source,
      form.sentence,
      form.explanation || null,
    ]

    try {
      const [result] = await pool.query<ResultSetHeader>(insertFormQuery, [
        ...values,
      ])

      return res.status(200).json({
        message: "Successfully inserted form data.",
        data: { success: true },
      })
    } catch (error) {
      const customError = new CustomError("Failed to insert form data.", 500)
      return next(customError)
    }
  }
)

export default router
