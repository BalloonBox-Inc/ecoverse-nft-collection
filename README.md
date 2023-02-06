# Ecoverse NFT Collection

NFT Collection built with Metaplex's Candy Machine

# Introduction

Welcome to the Ecoverse NFT Collection! This repo contain two parts.

## Ecoverse NFT Collection

An Ecoverse NFT is a unique digital asset that represents ownership of a piece of land tiles in Ecoverse. The NFT contains information about the forest. The forest information can use to calculate the carbon dioxide (CO2) sequestered by different plantations (farms) around the world.

## NFT API

This API allows you to update NFT with NFT ID. Because we need to store the forest information in an NFT, we can use the API to update the NFT.

This API work together with Ecoverse APIs\
https://github.com/BalloonBox-Inc/ecoverse-apis

# Description

1. src folder
   - An express API
   - Update NFT with selected land tiles
2. pre-steps folder
   - Create NFT collection
   - Create Metaplex's Candy Machine
   - One off steps

# Requirements

## Local

1. NodeJS version 16 and up
2. npm (preferred)
3. Typescript
4. Solana CLI

## Blockchain

Ecoverse is on Solana

1. Pinata JWT
   - see Pinata's docs
   - https://docs.pinata.cloud/
2. Quicknode RPC
   - see Quicknode's docs
   - https://www.quicknode.com/docs/solana
3. Generate Solana private key for third party auth
   - see Solana's docs
   - https://docs.solana.com/cli/conventions

# Local Development

1. Clone the project
2. Install
   - npm install

# Environment variables

1. Create `.env`
2. See the .env.example

# Run the pre-steps

1. npx ts-node pre-steps/1_create_collection.ts
2. npx ts-node pre-steps/2_create_candy_machine.ts
3. npx ts-node pre-steps/3_add_items.ts

# Run the API

1. Local DEV with build
   - npm run dev
2. Local PROD
   - npm start
3. Heroku run
   - npm run heroku
