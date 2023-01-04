import dotenv from 'dotenv'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js'
import secret from '../secrets/my-keypair.json'
import mint_secret from '../secrets/minter.json'

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
const WALLET_MINT = Keypair.fromSecretKey(new Uint8Array(mint_secret))

// NFT ID, Candy machine ID and NFT metadata
const CANDY_MACHINE_ID = process.env.CANDY_MACHINE_ID ?? ''

const METAPLEX_MINT = Metaplex.make(SOLANA_CONNECTION).use(
  keypairIdentity(WALLET_MINT)
)

// Mint NFTs
export async function mintNft() {
  const candyMachine = await METAPLEX_MINT.candyMachines().findByAddress({
    address: new PublicKey(CANDY_MACHINE_ID),
  })
  let { nft, response } = await METAPLEX_MINT.candyMachines().mint(
    {
      candyMachine,
      collectionUpdateAuthority: WALLET.publicKey,
      guards: { thirdPartySigner: { signer: WALLET } },
    },
    { commitment: 'finalized' }
  )

  console.log(`✅ - Minted NFT: ${nft.address.toString()}`)
  console.log(
    `     https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  )
  console.log(
    `     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
  )
}

mintNft()
