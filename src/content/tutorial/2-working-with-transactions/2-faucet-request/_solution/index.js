import { Client, ClientConfiguration, KeyPair, Address, Policy } from '@nimiq/core'
import { Entropy } from '@nimiq/utils'

console.log('Starting Nimiq client...')

// This is the Testnet Faucet URL
// You can also access it via browser at https://faucet.pos.nimiq-testnet.com/
const FAUCET_URL = 'https://faucet.pos.nimiq-testnet.com/tapit'

async function requestFundsFromFaucet(address) {
  try {
    const response = await fetch(FAUCET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        address: address.toUserFriendlyAddress(),
        withStackingContract: false
      })
    })

    if (!response.ok) {
      throw new Error(`Faucet request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('💰 Faucet request successful!')
    return data
  } catch (error) {
    console.error('❌ Faucet request failed:', error.message)
    throw error
  }
}

async function main() {
  try {
      // Create client configuration
  const config = new ClientConfiguration()
  // We can also use `MainAlbatross` for mainnet
  config.network('TestAlbatross')

  // We must explicitly set the seed nodes for testnet
  config.seedNodes([
    '/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed2.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed3.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed4.pos.nimiq-testnet.com/tcp/8443/wss',
  ])
    
    // Connect using pico which is faster
    // Read more at: https://www.nimiq.com/developers/learn/protocol/sync-protocol/nodes-and-sync
    config.syncMode('pico')
    
    // Print minimal messages
    config.logLevel('error')
    
    // Create the client instance
    const client = await Client.create(config.build())
    console.log('Client created, waiting for consensus...')
    
    // Wait for consensus
    await client.waitForConsensusEstablished()
    console.log('✅ Consensus established!')
    
    // Generate a new wallet
    const entropy = Entropy.generate()
    const wallet = {
      keyPair: KeyPair.derive(entropy),
      address: Address.derive(entropy)
    }
    
    console.log('🎉 Wallet created successfully!')
    console.log('Address:', wallet.address.toUserFriendlyAddress())
    
    // Check initial balance
    let balance = await client.getBalance(wallet.address)
    console.log('Initial Balance:', Policy.lunasToCoins(balance), 'NIM')
    
    // Request funds from faucet
    console.log('💧 Requesting funds from faucet...')
    await requestFundsFromFaucet(wallet.address)
    
    // Wait a bit for the transaction to be processed
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Check balance again
    balance = await client.getBalance(wallet.address)
    console.log('New Balance:', Policy.lunasToCoins(balance), 'NIM')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
