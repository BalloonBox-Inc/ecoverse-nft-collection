import dotenv from 'dotenv'
import { Connection, Keypair } from '@solana/web3.js'
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
const NFT_METADATA = process.env.NFT_METADATA ?? ''
const METAPLEX = Metaplex.make(SOLANA_CONNECTION).use(keypairIdentity(WALLET))

// Create NFT Collection
async function createCollectionNft() {
  const { nft: collectionNft } = await METAPLEX.nfts().create({
    name: 'Ecoverse Demo NFT Collection',
    uri: NFT_METADATA,
    sellerFeeBasisPoints: 0,
    isCollection: true,
    updateAuthority: WALLET,
  })

  console.log(`✅ - Minted Collection NFT: ${collectionNft.address.toString()}`)
  console.log(
    `     https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`
  )
}

createCollectionNft()
