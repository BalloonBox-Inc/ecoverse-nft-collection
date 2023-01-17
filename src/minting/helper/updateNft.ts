import dotenv from 'dotenv'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js'
import secret from '../../../secrets/my-keypair.json'

// initialize configuration
dotenv.config()

// Connect to Solana using Quicknode
const QUICKNODE_RPC = process.env.QUICKNODE_RPC ?? '' // 👈 Replace with your QuickNode Solana Devnet HTTP Endpoint
const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9) // Random unique identifier for your session
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC, {
  commitment: 'finalized',
  httpHeaders: { 'x-session-hash': SESSION_HASH },
})

// Read the Serect Key from local
const WALLET = Keypair.fromSecretKey(new Uint8Array(secret))

// NFT ID, Candy machine ID and NFT metadata

const METAPLEX = Metaplex.make(SOLANA_CONNECTION).use(keypairIdentity(WALLET))

// Create NFT Collection
export async function updateNft(id: string, cid: string) {
  const mintAddress = new PublicKey(id)
  const nft = await METAPLEX.nfts().findByMint({ mintAddress })
  const PINATA_URL = `${process.env.PINATA_URL_PREFIX ?? ''}${cid}`
  await METAPLEX.nfts().update({
    nftOrSft: nft,
    uri: PINATA_URL,
  })
  return 'Successful!'
}
