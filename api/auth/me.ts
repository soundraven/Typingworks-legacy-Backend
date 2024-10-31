import express, { Request, Response, NextFunction } from "express"
import { CustomError } from "../../types/errorStructure"
import axios, { AxiosError } from "axios"

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
    const accessToken = req.body.accessToken
    const refreshToken = req.body.refreshToken

    try {
      if (accessToken) {
        const userInfoResponse = await axios.get(
          "https://kapi.kakao.com/v2/user/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        const user = {
          id: userInfoResponse.data.id,
          nickname: userInfoResponse.data.properties.nickname,
        }

        return res.status(200).json({
          message: "Successfully retrieved access token and user info.",
          data: { user: user },
        })
      } else if (refreshToken) {
        const tokenResponse = await axios.post(
          "https://kauth.kakao.com/oauth/token",
          null,
          {
            params: {
              grant_type: "refresh_token",
              client_id: process.env.KAKAO_REST_API_KEY,
              refresh_token: refreshToken,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )

        const newAccessToken = tokenResponse.data.access_token

        const userInfoResponse = await axios.get(
          "https://kapi.kakao.com/v2/user/me",
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        )

        const user = {
          id: userInfoResponse.data.id,
          nickname: userInfoResponse.data.properties.nickname,
        }

        return res.status(200).json({
          message: "Successfully retrieved new access token and user info.",
          data: {
            accessToken: newAccessToken,
            user: user,
          },
        })
      } else {
        return res
          .status(400)
          .json({ message: "No access or refresh token provided." })
      }
    } catch (error) {
      const axiosError = error as AxiosError

      const errorMessage =
        (axiosError.response?.data as KakaoErrorResponse)?.error_description ||
        "Failed to retrieve user info."
      const statusCode = axiosError.response?.status || 500

      const customError = new CustomError(errorMessage, statusCode)
      return next(customError)
    }
  }
)

export default router
