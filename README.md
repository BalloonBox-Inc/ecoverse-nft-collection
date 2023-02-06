# Ecoverse NFT Collection

NFT Collection built with Metaplex's Candy Machine

# Introduction

Welcome to the Ecoverse NFT Collection! This repo contain two parts.

## Ecoverse NFT Collection

An Ecoverse NFT is a unique digital asset that represents ownership of a piece of land tiles in Ecoverse. The NFT contains information about the forest. The forest information can use to calculate the carbon dioxide (CO2) sequestered by different plantations (farms) around the world.

## NFT API

This API allows you to update NFT with NFT ID. Because we need to store the forest information in an NFT, we can use the API to update the NFT.

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

## Blockchain

1. Pinata JWT
2. Quicknode RPC

# Local Development

1. Clone the project
2. Install
   - npm install

# Environment variables

1. Create `.env`
2. See the .env.example

# Run the API

1. Local DEV with build
   - npm run dev
2. Local PROD
   - npm start
3. Heroku run
   - npm run heroku
