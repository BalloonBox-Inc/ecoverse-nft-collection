import axios from 'axios'
import dotenv from 'dotenv'
import { ecoverseLogin } from '../../common/ecoverseLogin'

// initialize configuration
dotenv.config()

export async function updateBackend(NftId: string) {
  try {
    const requestLogin = await ecoverseLogin()
    const BACKEND_URL = process.env.BACKEND_URL ?? ''
    const JWT = `Bearer ${requestLogin}`

    console.log(JWT)

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: JWT,
      },
    }

    // 👇️ const data: CreateUserResponse
    const { data } = await axios.post(
      `${BACKEND_URL}/api/v1/nft/update/${NftId}`,
      '',
      headers
    )
    console.log(data)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message)
      // 👇️ error: AxiosError<any, any>
      return error.message
    } else {
      console.log('unexpected error: ', error)
      return 'An unexpected error occurred'
    }
  }
}
