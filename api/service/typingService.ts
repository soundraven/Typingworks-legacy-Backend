import { pool } from "../index"

export const getSentence = async (
  oneCycle: number,
  language: string,
  type: string
) => {
  const connection = await pool.getConnection()

  let getSentenceQuery = `
    SELECT
      *
    FROM
      sentence
    WHERE
      active = 1
      ${type ? `AND type = ${type}` : ""}
      ${language ? `AND language = ${language}` : `AND language = 'kr'`}
    ORDER BY
      RAND()
    LIMIT ${oneCycle}`

  try {
    const [result] = await connection.query(getSentenceQuery)
    return result
  } finally {
    connection.release()
  }
}

export const getLanguage = async () => {}
