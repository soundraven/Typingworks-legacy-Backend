import express, { Request, Response, NextFunction } from "express"
import { CustomError } from "../structure/errorStructure"
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
    const { code } = req.body

    try {
      const tokenResponse = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        null,
        {
          params: {
            grant_type: "authorization_code",
            client_id: "ce7b69089aa5023470e6a5e5a89e5e48",
            redirect_uri: "http://localhost:3000/auth/kakaologin",
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

        console.log(userInfoResponse.data)

        return res.status(200).json({
          message: "Successfully retrieved access token and user info.",
          data: {
            accessToken: accessToken,
            user: userInfoResponse.data,
          },
        })
      } else {
        throw new Error("Failed to get access token from Kakao.")
      }
    } catch (error) {
      const axiosError = error as AxiosError

      const customError: CustomError = {
        name: "TokenRetrievalError",
        message:
          (axiosError.response?.data as KakaoErrorResponse)
            ?.error_description ||
          "Failed to retrieve access token from Kakao.",
        status: axiosError.response?.status || 500,
      }
      return next(customError)
    }
  }
)

export default router
