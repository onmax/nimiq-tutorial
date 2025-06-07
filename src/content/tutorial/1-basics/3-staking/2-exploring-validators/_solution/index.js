import * as Nimiq from '@nimiq/core'
import {
  createAndConnectClient,
  displayNetworkInfo,
  getActiveValidators,
  displayValidators
} from '../../_utils/index.js'

console.log('Starting Nimiq client to explore validators...')

async function main() {
  try {
    // Create client and connect to network
    const client = await createAndConnectClient()
    
    // Display current network information
    await displayNetworkInfo(client)
    
    // Query and display active validators
    const validators = await getActiveValidators(client)
    displayValidators(validators)
    
    // Get staking contract address
    const stakingContract = Nimiq.Address.CONTRACT_CREATION
    console.log('\n🏦 Staking Contract:')
    console.log(`  Address: ${stakingContract.toUserFriendlyAddress()}`)
    
    console.log('\n✨ Validator exploration complete!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
