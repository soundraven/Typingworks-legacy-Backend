import express, { Request, Response, NextFunction } from "express"
import { CustomError } from "../structure/errorStructure"
import axios, { AxiosError } from "axios"
import { pool } from "../index"
import dayjs from "dayjs"
import crypto from "crypto"

const router = express.Router()

interface KakaoErrorResponse {
  error: string
  error_description: string
}

router.post(
  "/",
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { code } = req.body

    try {
      console.log(process.env.KAKAO_REST_API_KEY)
      const tokenResponse = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        null,
        {
          params: {
            grant_type: "authorization_code",
            client_id: process.env.KAKAO_REST_API_KEY,
            redirect_uri: process.env.REDIRECT_URI,
            code,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )

      console.log(tokenResponse.data)

      const refreshToken = tokenResponse.data.refresh_token
      const accessToken = tokenResponse.data.access_token

      if (accessToken) {
        const userInfoResponse = await axios.get(
          "https://kapi.kakao.com/v2/user/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        const encryptedRefreshToken: string = crypto
          .createHash("sha256")
          .update(refreshToken + process.env.REFRESH_TOKEN_SALT)
          .digest("hex")
        const setRefreshTokenQuery = `INSERT INTO auth (refresh_token, registered_by, expires) VALUES (?, ?, ?)`
        const currentTime = dayjs()

        const refreshTokenExpires = currentTime
          .add(tokenResponse.data.refresh_token_expires_in, "second")
          .format("YYYY-MM-DD HH:mm:ss")

        console.log("유저정보", userInfoResponse.data)
        console.log(userInfoResponse.data.id)
        console.log(encryptedRefreshToken)

        const [result] = await pool.query(setRefreshTokenQuery, [
          encryptedRefreshToken,
          userInfoResponse.data.id,
          refreshTokenExpires,
        ])

        console.log(result)

        return res.status(200).json({
          message: "Successfully retrieved access token and user info.",
          data: {
            accessToken: accessToken,
            user: userInfoResponse.data,
          },
        })
      } else {
        return res
          .status(400)
          .json({ message: "Failed to get access token from Kakao." })
      }
    } catch (error) {
      const axiosError = error as AxiosError

      const errorMessage =
        (axiosError.response?.data as KakaoErrorResponse)?.error_description ||
        "Failed to retrieve access token from Kakao."

      const statusCode = axiosError.response?.status || 500

      const customError: CustomError = {
        name: "TokenRetrievalError",
        message: errorMessage,
        status: statusCode,
      }

      return next(customError)
    }
  }
)

export default router
