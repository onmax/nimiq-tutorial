import { getClient } from './lib/consensus.js'

async function main() {
  try {
    // 1. Connect to the Nimiq network
    const client = await getClient('MainAlbatross')
    console.log('✅ Successfully connected to the Nimiq Mainnet')

    // TODO 2: Define the staking contract address

    // TODO 3: Retrieve the staking contract's account data

    // TODO 4: Extract the list of active validators

    // TODO 5: Display the list of active validators
  }
  catch (error) {
    console.error('❌ Error:', error)
  }
}

main().catch(console.error)
