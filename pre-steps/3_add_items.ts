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
const NFT_METADATA =
  'https://mfp2m2qzszjbowdjl2vofmto5aq6rtlfilkcqdtx2nskls2gnnsa.arweave.net/YV-mahmWUhdYaV6q4rJu6CHozWVC1CgOd9NkpctGa2Q'
const CANDY_MACHINE_ID = process.env.CANDY_MACHINE_ID ?? ''

const METAPLEX = Metaplex.make(SOLANA_CONNECTION).use(keypairIdentity(WALLET))

// interface for Item
interface Item {
  name: string
  uri: string
}

// Add Items to Candy Machine
async function addItems() {
  const candyMachine = await METAPLEX.candyMachines().findByAddress({
    address: new PublicKey(CANDY_MACHINE_ID),
  })
  const items: Item[] = []
  for (let i = 0; i < 3; i++) {
    // Add 3 NFTs (the size of our collection)
    items.push({
      name: `QuickNode Demo NFT # ${i + 1}`,
      uri: NFT_METADATA,
    })
  }
  const { response } = await METAPLEX.candyMachines().insertItems({
    candyMachine,
    items: items,
  })

  console.log(`✅ - Items added to Candy Machine: ${CANDY_MACHINE_ID}`)
  console.log(
    `     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
  )
}

addItems()
