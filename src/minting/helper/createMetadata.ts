import axios from 'axios'
import dotenv from 'dotenv'
import { NftRequest } from '../mint.interface'

// initialize configuration
dotenv.config()

const PINATA_JWT = process.env.PINATA_JWT ?? ''
const PINATA_PINJSON_URL = process.env.PINATA_PINJSON_URL ?? ''
const PINATA_URL_PREFIX = process.env.PINATA_URL_PREFIX ?? ''
const JWT = `Bearer ${PINATA_JWT}`

export async function createMetadata(request: NftRequest) {
  try {
    const IMG_CID = process.env.IMG_CID ?? ''
    const metadata = {
      name: request.nftName,
      description: 'Land tiles on ecoverse',
      image: `${PINATA_URL_PREFIX}${IMG_CID}`,
      external_url: 'https://ecoverse.farm',
      attributes: [
        {
          trait_type: 'farmId',
          value: request.farmId,
        },
        {
          trait_type: 'nftArea',
          value: request.nftArea,
        },
        {
          trait_type: 'scientificName',
          value: request.scientificName,
        },
        {
          trait_type: 'mintStartDate',
          value: request.mintStartDate,
        },
        {
          trait_type: 'mintEndDate',
          value: request.mintEndDate,
        },
        {
          trait_type: 'tileCount',
          value: request.tileCount,
        },
        {
          trait_type: 'plantStatus',
          value: request.plantStatus,
        },
        {
          trait_type: 'carbonUrl',
          value: request.carbonUrl,
        },
        {
          trait_type: 'geolocation',
          value: request.geolocation,
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
