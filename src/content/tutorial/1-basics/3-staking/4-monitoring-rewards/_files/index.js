import * as Nimiq from '@nimiq/core'
import { Entropy } from '@nimiq/utils'

console.log('Starting Nimiq client for staking monitoring...')

// Helper function to get testnet funds
async function requestFromFaucet(address) {
  const faucetUrl = 'https://faucet.pos.nimiq-testnet.com/tapit'
  
  try {
    const response = await fetch(faucetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `address=${address.toUserFriendlyAddress()}`
    })
    
    return response.ok
  } catch (error) {
    console.error('❌ Error requesting from faucet:', error.message)
    return false
  }
}

async function main() {
  try {
    // Create client configuration
    const config = new Nimiq.ClientConfiguration()
    config.network('TestAlbatross')
    
    // Create the client instance
    const client = await Nimiq.Client.create(config.build())
    console.log('Client created, waiting for consensus...')
    
    // Wait for consensus
    await client.waitForConsensusEstablished()
    console.log('✅ Consensus established!')
    
    // Create a wallet and get funds (reusing setup from previous lessons)
    const entropy = Entropy.generate()
    const wallet = {
      keyPair: Nimiq.KeyPair.derive(entropy),
      address: Nimiq.Address.derive(entropy)
    }
    
    console.log('🎉 Wallet created!')
    console.log('Address:', wallet.address.toUserFriendlyAddress())
    
    // Get testnet funds
    const faucetSuccess = await requestFromFaucet(wallet.address)
    if (!faucetSuccess) {
      console.log('❌ Failed to get testnet funds')
      return
    }
    
    // Wait for funds and create delegation transaction
    console.log('⏳ Waiting for funds...')
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    const balance = await client.getBalance(wallet.address)
    console.log('💰 Balance:', Nimiq.Policy.lunasToCoins(balance), 'NIM')
    
    if (balance === 0) {
      console.log('❌ No funds available for staking')
      return
    }
    
    // Get validators and create delegation transaction
    const validators = await client.getActiveValidators()
    const selectedValidator = validators[0]
    const delegationAmount = Math.floor(balance * 0.5)
    
    // TODO: Create and sign the delegation transaction
    // (Copy from previous lesson or implement)
    
    // TODO: Send the transaction to the network
    // Hint: Use client.sendTransaction(signedTransaction)
    
    // TODO: Wait for transaction confirmation
    // Check transaction status with client.getTransaction(txHash)
    
    // TODO: Query delegation status
    // Check your staked amount and validator
    
    // TODO: Simulate monitoring rewards over time
    // Show how rewards would accumulate
    
    console.log('📊 Ready to monitor staking rewards!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
