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

    // 4. Fetch additional data from Nimiq Validators API
    const validatorsData = await getValidators(network)

    // 5. Calculate total staked amount
    const stakedSupplyRatio = await getStakedSupplyRatio(network)

    // 6. Merge on-chain and off-chain data
    const enhancedValidators = contract.activeValidators.map(([address, balance]) => {
      const validatorInfo = validatorsData.find(v => v.address === address) || {}
      const totalStake = balance / 1e5

      // Estimate yearly rewards ratio
      const { gainRatio } = calculateStakingRewards({
        stakedSupplyRatio,
        days: 365,
        fee: validatorInfo.fee,
      })

      return {
        'name': validatorInfo.name || 'N/A',
        address,
        'total stake (NIM)': totalStake.toFixed(2),
        'yearly reward (%)': (gainRatio * 100).toFixed(2),
        'fee %': validatorInfo.fee,
        'vts': validatorInfo.score?.total || 0,
      }
    })

    // 7. Sort and display the final list
    enhancedValidators.sort((a, b) => b.vts - a.vts)
    console.table(enhancedValidators)
  }
  catch (error) {
    console.error('❌ Error:', error)
  }
}

main().catch(console.error)
