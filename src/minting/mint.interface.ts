export interface NftRequest {
  nftId: string
  nftName: string
  nftArea: number
  nftValueSol: number
  geolocation: string
  tileCount: number
  carbonUrl: string
  mintStartDate: string
  mintEndDate: string
  farmId: string
  scientificName: Array<string>
  plantStatus: string
}

export interface NftUpdateApiResponse {
  details: string
  signature: string | null
}

export interface NftUpdateResponse {
  message: string
  code: number
}
