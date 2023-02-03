import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Response,
  Route,
  SuccessResponse,
} from 'tsoa'
import { NftRequest, NftUpdateApiResponse } from './mint.interface'
import { updateNft } from './helper/updateNft'
import { createMetadata } from './helper/createMetadata'

@Route('/nft')
export class NftController extends Controller {
  /**
   * Update NFT with the NFT ID
   */
  @Response('400', 'Failed')
  @SuccessResponse('200', 'Updated') // Custom success response
  @Post('/update')
  public async updateNft(
    @Body() requestBody: NftRequest
  ): Promise<NftUpdateApiResponse> {
    // Upload the NFT info to Pinata IPFS node
    const ipfs_cid = await createMetadata(requestBody)
    // Update the NFT with new IPFS hash and name
    const result = await updateNft(
      requestBody.nftId,
      requestBody.nftName,
      ipfs_cid.IpfsHash
    )

    if (result.code == 200) {
      this.setStatus(200) // set return status 200
      return { details: 'Update Successful!', signature: result.message }
    } else {
      this.setStatus(400)
      return { details: result.message, signature: null }
    }
    // new UsersService().create(requestBody);
  }
}
