import dotenv from 'dotenv'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js'
import secret from '../secrets/my-keypair.json'

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
async function updateNft() {
  const mintAddress = new PublicKey(
    '8QqEmTRQ143QM7hv8dGZY8R9BswQRhoDov7GFWwVtnfT'
  )
  const nft = await METAPLEX.nfts().findByMint({ mintAddress })
  await METAPLEX.nfts().update({
    nftOrSft: nft,
    name: 'Minted NFT LOL',
  })
}

updateNft()
