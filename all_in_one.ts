import dotenv from 'dotenv'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  toBigNumber,
  CreateCandyMachineInput,
  DefaultCandyGuardSettings,
  CandyMachineItem,
  toDateTime,
  sol,
  TransactionBuilder,
  CreateCandyMachineBuilderContext,
} from '@metaplex-foundation/js'
import secret from './secrets/my-keypair.json'
import mint_secret from './secrets/minter.json'

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
const MINTER_KEY = JSON.parse(process.env.MINTER_KEY ?? '')
const WALLET_MINT = Keypair.fromSecretKey(new Uint8Array(MINTER_KEY))

// NFT ID, Candy machine ID and NFT metadata
const NFT_METADATA =
  'https://mfp2m2qzszjbowdjl2vofmto5aq6rtlfilkcqdtx2nskls2gnnsa.arweave.net/YV-mahmWUhdYaV6q4rJu6CHozWVC1CgOd9NkpctGa2Q'
const COLLECTION_NFT_MINT = process.env.COLLECTION_NFT_MINT ?? ''
const CANDY_MACHINE_ID = process.env.CANDY_MACHINE_ID ?? ''

const METAPLEX = Metaplex.make(SOLANA_CONNECTION).use(keypairIdentity(WALLET))
const METAPLEX_MINT = Metaplex.make(SOLANA_CONNECTION).use(
  keypairIdentity(WALLET_MINT)
)

// Create NFT Collection
async function createCollectionNft() {
  const { nft: collectionNft } = await METAPLEX.nfts().create({
    name: 'QuickNode Demo NFT Collection',
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

// Modify Existing NFT
async function modifyItems() {
  const candyMachine = await METAPLEX.candyMachines().findByAddress({
    address: new PublicKey(CANDY_MACHINE_ID),
  })
  const { response } = await METAPLEX.candyMachines().insertItems({
    candyMachine,
    index: 0,
    items: [{ name: 'BBOX Demo NFT # 100', uri: NFT_METADATA }],
  })

  console.log(`✅ - Items added to Candy Machine: ${CANDY_MACHINE_ID}`)
  console.log(
    `     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
  )
}

async function printItems() {
  const candyMachine = await METAPLEX.candyMachines().findByAddress({
    address: new PublicKey(CANDY_MACHINE_ID),
  })
  const nfts = await METAPLEX.candyMachines().refresh(candyMachine)
  console.log(nfts.items[0].index) // "My NFT #1"
  console.log(nfts.items[1].index) // "My NFT #X"
  console.log(nfts.items[2].index) // "My NFT #3"
}

// Create Candy Guards
async function updateCandyMachine() {
  const candyMachine = await METAPLEX.candyMachines().findByAddress({
    address: new PublicKey(CANDY_MACHINE_ID),
  })

  const { response } = await METAPLEX.candyMachines().update({
    candyMachine,
    maxEditionSupply: toBigNumber(3), // 0 reproductions of each NFT allowed
  })

  console.log(`✅ - Updated Candy Machine: ${CANDY_MACHINE_ID}`)
  console.log(
    `     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
  )
}

// Create NFT Collection
// async function updateNft() {
//     const mintAddress = new PublicKey(
//         '8QqEmTRQ143QM7hv8dGZY8R9BswQRhoDov7GFWwVtnfT'
//     )
//     const nft = await METAPLEX.nfts().findByMint({ mintAddress })
//     await METAPLEX.nfts().update({
//         nftOrSft: nft,
//         name: 'Minted NFT LOL',
//     })

//     const candyMachine = await METAPLEX.candyMachines().findByAddress({
//         address: new PublicKey(CANDY_MACHINE_ID),
//     })
//     const nfts = await METAPLEX.candyMachines().refresh(candyMachine)
//     console.log(nfts.items[0].name) // "My NFT #1"
//     console.log(nfts.items[1].name) // "My NFT #X"
//     console.log(nfts.items[2].name) // "My NFT #3"
// }

// Run to create Candy Guards
// updateCandyMachine();

// Step 1: Run when create NFT collection
// createCollectionNft()

// Step 2: Run when create Candy Machine
// generateCandyMachine()

// Step 3: Run to add items
// addItems()

// Step 4: Modify Existing NFT funtion
// modifyItems()

// Step 5: Mint NFT function
// mintNft()

// Print NFTs
// printItems()

// Run to create Candy Guards
// updateCandyMachine()

// updateNft()
