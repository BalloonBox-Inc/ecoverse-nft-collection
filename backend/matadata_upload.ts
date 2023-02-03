import axios from 'axios'
import dotenv from 'dotenv'

// initialize configuration
dotenv.config()

const PINATA_JWT = process.env.PINATA_JWT ?? ''
const PINATA_PINJSON_URL = process.env.PINATA_PINJSON_URL ?? ''
const PINATA_URL_PREFIX = process.env.PINATA_URL_PREFIX ?? ''
const JWT = `Bearer ${PINATA_JWT}`

export async function createUser(
  IpfsHash: string,
  start_date: Date,
  end_date: Date,
  tile_count: number,
  status: string,
  area: number,
  url: string,
  geojson: string
) {
  try {
    const metadata = {
      name: 'ECOVERSE #1',
      description: 'Generative art on Solana.',
      image: `${PINATA_URL_PREFIX}${IpfsHash}`,
      external_url: 'https://ecoverse.io',
      attributes: [
        {
          trait_type: 'start_date',
          value: start_date,
        },
        {
          trait_type: 'end_date',
          value: end_date,
        },
        {
          trait_type: 'tile_count',
          value: tile_count,
        },
        {
          trait_type: 'status',
          value: status,
        },
        {
          trait_type: 'area',
          value: area,
        },
        {
          trait_type: 'url',
          value: url,
        },
        {
          trait_type: 'geojson',
          value: geojson,
        },
      ],
      category: 'image',
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: JWT,
      },
    }

    var pin_data = JSON.stringify({
      pinataContent: metadata,
    })

    var config = {
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      headers: {
        'Content-Type': 'application/json',
        Authorization: JWT,
      },
      data: metadata,
    }

    // 👇️ const data: CreateUserResponse
    const { data } = await axios.post(PINATA_PINJSON_URL, pin_data, headers)

    console.log(JSON.stringify(data, null, 4))

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

// let start_date: Date = new Date('2023-01-10')
// let end_date: Date = new Date('2023-02-01')

// createUser(
//   'QmbCp5U3DK2b1bjkUmnYy4BgM7dc8L2FmzWkQMUtQQDGx2',
//   start_date,
//   end_date,
//   10,
//   'Alive',
//   100,
//   'https://ecoverse.io',
//   'abcdefg'
// )
