export interface NftRequest {
  id: string
  nft_name: string
  nft_area: number
  tile_count: number
  cabon_url: string
  start_date: Date
  end_date: Date
  farmid: number
  genus_name: string
  species_name: string
  plant_status: string
  geojson: string
}

export interface NftUpdateApiResponse {
  details: string
  signature: string | null
}

export interface NftUpdateResponse {
  message: string
  code: number
}
