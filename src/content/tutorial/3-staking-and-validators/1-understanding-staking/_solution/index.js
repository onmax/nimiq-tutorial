import { getClient } from './lib/consensus.js'

async function main() {
  try {
    // 1. Connect to the Nimiq Mainnet
    const client = await getClient('MainAlbatross')

    // 2. Define the staking contract address
    const STAKING_CONTRACT_ADDRESS = 'NQ77 0000 0000 0000 0000 0000 0000 0000 0001'

    // 3. Retrieve the staking contract's account data
    const contract = await client.getAccount(STAKING_CONTRACT_ADDRESS)

    // 4. Extract and display the list of active validators
    const activeValidators = contract.activeValidators.map(([address, balance]) => ({
      address,
      balance: `${balance / 1e5} NIM`,
    }))
    console.table(activeValidators)
  }
  catch (error) {
    console.error('❌ Error:', error)
  }
}

main().catch(console.error)
