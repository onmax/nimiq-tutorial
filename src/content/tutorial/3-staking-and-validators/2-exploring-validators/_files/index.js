import { calculateStakingRewards } from '@nimiq/utils/rewards-calculator'
import { getClient } from './lib/consensus.js'
import { getStakedSupplyRatio, getValidators } from './lib/validators-api.js'

async function main() {
  try {
    const network = 'MainAlbatross'

    // 1. Connect to the Nimiq Mainnet
    const client = await getClient(network)

    // 2. Define the staking contract address
    const STAKING_CONTRACT_ADDRESS = 'NQ77 0000 0000 0000 0000 0000 0000 0000 0001'

    // 3. Retrieve the staking contract's account data
    const contract = await client.getAccount(STAKING_CONTRACT_ADDRESS)

    // TODO 4. Fetch additional data from Nimiq Validators API

    // TODO 5. Calculate total staked supply ratio

    // TODO 6. Merge on-chain and off-chain data

    // TODO 7. Sort and display the final list
    console.table(contract.activeValidators)
  }
  catch (error) {
    console.error('❌ Error:', error)
  }
}

main().catch(console.error)
