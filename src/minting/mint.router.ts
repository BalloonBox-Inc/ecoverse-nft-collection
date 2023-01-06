/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from 'express'
import { updateNft } from '../../backend/update'
import { Nft } from './mint.interface'
/**
 * Router Definition
 */
export const nftRouter = express.Router()
/**
 * Controller Definitions
 */

// GET items

// GET items/:id

// POST items
nftRouter.post('/', async (req: Request, res: Response) => {
  try {
    const nft: Nft = req.body
    console.log(`${nft.id}`)
    const result = await updateNft(nft.id)
    res.status(201).json(result)
  } catch (e: any) {
    res.status(500).send(e.message)
  }
})
// PUT items/:id

// DELETE items/:id
