import express, { Request, Response, NextFunction } from "express"
import { CustomError } from "../structure/errorStructure"
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
    console.log("요청 수락")
    const form: RuleForm = req.body.form
    console.log(form)
    form.language === "Korean" ? (form.language = "kr") : (form.language = "En")
    form.sentenceType === "Quote"
      ? (form.sentenceType = "quote")
      : (form.sentenceType = "pangram")
    console.log(form)

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
      const [result] = await pool.query<ResultSetHeader>(insertFormQuery, [
        ...values,
      ])

      if (result.affectedRows === 1) {
        const success: Boolean = true
        return res.status(200).json({
          message: "Successfully inserted form data.",
          data: success,
        })
      } else {
        throw new Error("Form insertion failed")
      }
    } catch (error) {
      const customError: CustomError = {
        name: "FormInsertionError",
        message: "Failed to insert form data.",
        status: 500,
      }
      return next(customError)
    }
  }
)

export default router
