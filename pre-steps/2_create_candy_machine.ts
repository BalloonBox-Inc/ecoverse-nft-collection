import dotenv from 'dotenv'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import {
  Metaplex,
  keypairIdentity,
  toBigNumber,
  CreateCandyMachineInput,
  DefaultCandyGuardSettings,
  toDateTime,
  sol,
} from '@metaplex-foundation/js'
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
const ADMIN_KEY = JSON.parse(process.env.ADMIN_KEY ?? '')
const WALLET = Keypair.fromSecretKey(new Uint8Array(ADMIN_KEY))

// NFT ID, Candy machine ID and NFT metadata
const COLLECTION_NFT_MINT = process.env.COLLECTION_NFT_MINT ?? ''

const METAPLEX = Metaplex.make(SOLANA_CONNECTION).use(keypairIdentity(WALLET))

// Create Candy Machine
async function generateCandyMachine() {
  const candyMachineSettings: CreateCandyMachineInput<DefaultCandyGuardSettings> =
    {
      itemsAvailable: toBigNumber(3), // Collection Size: 3
      sellerFeeBasisPoints: 1000, // 10% Royalties on Collection
      symbol: 'DEMO',
      maxEditionSupply: toBigNumber(0), // 0 reproductions of each NFT allowed
      isMutable: true,
      creators: [{ address: WALLET.publicKey, share: 100 }],
      collection: {
        address: new PublicKey(COLLECTION_NFT_MINT), // Can replace with your own NFT or upload a new one
        updateAuthority: WALLET,
      },
      guards: {
        startDate: { date: toDateTime('2022-10-17T16:00:00Z') },
        mintLimit: {
          id: 1,
          limit: 2,
        },
        solPayment: {
          amount: sol(0.1),
          destination: METAPLEX.identity().publicKey,
        },
        thirdPartySigner: {
          signerKey: WALLET.publicKey,
        },
      },
    }
  const { candyMachine } = await METAPLEX.candyMachines().create(
    candyMachineSettings
  )
  console.log(`✅ - Created Candy Machine: ${candyMachine.address.toString()}`)
  console.log(
    `     https://explorer.solana.com/address/${candyMachine.address.toString()}?cluster=devnet`
  )
}

generateCandyMachine()
