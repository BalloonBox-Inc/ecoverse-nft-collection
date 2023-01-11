import axios from 'axios'
import dotenv from 'dotenv'

// initialize configuration
dotenv.config()

const PINATA_JWT = process.env.PINATA_JWT ?? ''
const PINATA_PINJSON_URL = process.env.PINATA_PINJSON_URL ?? ''
const PINATA_URL_PREFIX = process.env.PINATA_URL_PREFIX ?? ''
const JWT = `Bearer ${PINATA_JWT}`

async function createUser(IpfsHash: string) {
  try {
    const metadata = {
      name: 'ECOVERSE #1',
      description: 'Generative art on Solana.',
      image: `${PINATA_URL_PREFIX}${IpfsHash}`,
      external_url: 'https://ecoverse.io',
      attributes: [
        {
          trait_type: 'landtiles',
          value: 'value1',
        },
        {
          trait_type: 'treetype',
          value: 'value2',
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

    console.log(pin_data)
    console.log(headers)

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

createUser('QmWiJdVKUGVL7z9RG7zgfV3eNM7yF1WQFDFUQMfsRckpJF')
