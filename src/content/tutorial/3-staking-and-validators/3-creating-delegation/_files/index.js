import * as Nimiq from '@nimiq/core'
import { Entropy } from '@nimiq/utils'

console.log('Starting Nimiq client for staking delegation...')

async function requestFromFaucet(address) {
  const faucetUrl = 'https://faucet.pos.nimiq-testnet.com/tapit'
  
  try {
    console.log('💧 Requesting funds from faucet...')
    
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
    // We can also use `MainAlbatross` for mainnet
    config.network('TestAlbatross')

    // We must explicitly set the seed nodes for testnet
    config.seedNodes([
      '/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed2.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed3.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed4.pos.nimiq-testnet.com/tcp/8443/wss',
    ])
    
    // Create the client instance
    const client = await Nimiq.Client.create(config.build())
    console.log('Client created, waiting for consensus...')
    
    // Wait for consensus
    await client.waitForConsensusEstablished()
    console.log('✅ Consensus established!')
    
    // Create a wallet
    const entropy = Entropy.generate()
    const wallet = {
      keyPair: Nimiq.KeyPair.derive(entropy),
      address: Nimiq.Address.derive(entropy)
    }
    
    console.log('🎉 Wallet created!')
    console.log('Address:', wallet.address.toUserFriendlyAddress())
    
    // Request testnet funds
    const faucetSuccess = await requestFromFaucet(wallet.address)
    if (!faucetSuccess) {
      console.log('❌ Failed to get testnet funds')
      return
    }
    
    // Wait for funds to arrive
    console.log('⏳ Waiting for funds...')
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    const balance = await client.getBalance(wallet.address)
    console.log('💰 Balance:', Nimiq.Policy.lunasToCoins(balance), 'NIM')
    
    if (balance === 0) {
      console.log('❌ No funds available for staking')
      return
    }
    
    // TODO: Get active validators
    // Hint: Use client.getActiveValidators()
    
    // TODO: Choose a validator to delegate to
    // Pick the first validator for simplicity
    
    // TODO: Create staking transaction data
    // Use Nimiq.StakingDataBuilder for delegation
    
    // TODO: Create the staking transaction
    // Target: staking contract, value: amount to stake
    
    // TODO: Sign the transaction
    
    console.log('🏗️  Ready to create delegation transaction!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
