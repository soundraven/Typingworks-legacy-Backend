import { pool } from "../index"

export const getRandomTypeSentence = async (oneCycle: number) => {
  if (!pool) throw new Error("Database pool not available")

  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.query(
      `SELECT * FROM sentence ORDER BY RAND() LIMIT ${oneCycle}`
    )
    return rows
  } finally {
    connection.release()
  }
}
