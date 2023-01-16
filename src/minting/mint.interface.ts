import internal from 'stream'

export interface NftRequest {
  id: string
  img_cid: string
  farmid: number
  start_date: Date
  end_date: Date
  tile_count: number
  status: string
  area: number
  url: string
  geojson: string
}

export interface NftResponse {
  message: string
}
