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
    const result = await updateNft(requestBody.id)
    this.setStatus(201) // set return status 201
    // new UsersService().create(requestBody);
    return
  }
}
