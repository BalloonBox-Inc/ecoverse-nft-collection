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
      name: request.nft_name,
      description: 'Land tiles on ecoverse',
      image: `${PINATA_URL_PREFIX}${IMG_CID}`,
      external_url: 'https://ecoverse.farm',
      attributes: [
        {
          trait_type: 'farmid',
          value: request.farmid,
        },
        {
          trait_type: 'nft_area',
          value: request.nft_area,
        },
        {
          trait_type: 'genus_name',
          value: request.genus_name,
        },
        {
          trait_type: 'species_name',
          value: request.species_name,
        },
        {
          trait_type: 'start_date',
          value: request.start_date,
        },
        {
          trait_type: 'end_date',
          value: request.end_date,
        },
        {
          trait_type: 'tile_count',
          value: request.tile_count,
        },
        {
          trait_type: 'plant_status',
          value: request.plant_status,
        },
        {
          trait_type: 'cabon_url',
          value: request.cabon_url,
        },
        {
          trait_type: 'geojson',
          value: request.geojson,
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
