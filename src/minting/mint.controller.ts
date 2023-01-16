import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from 'tsoa'
import { NftRequest, NftResponse } from './mint.interface'
import { updateNft } from '../../backend/update'
import { createUser } from '../../backend/matadata_upload'

@Route('/nft')
export class NftController extends Controller {
  @Get('/')
  public async getUser(): Promise<NftResponse> {
    return {
      message: 'Hello World!!!!',
    }
  }

  @SuccessResponse('201', 'Updated') // Custom success response
  @Post()
  public async updateNft(@Body() requestBody: NftRequest): Promise<void> {
    const IMG_CID = process.env.IMG_CID ?? ''
    const ipfs_cid = await createUser(
      IMG_CID,
      requestBody.start_date,
      requestBody.end_date,
      requestBody.tile_count,
      requestBody.status,
      requestBody.area,
      requestBody.url,
      requestBody.geojson
    )
    const result = await updateNft(requestBody.id, ipfs_cid.IpfsHash)
    this.setStatus(201) // set return status 201
    // new UsersService().create(requestBody);
    return
  }
}
