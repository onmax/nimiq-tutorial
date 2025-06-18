import { Client, ClientConfiguration, KeyPair, Address, Policy, Transaction, TransactionReceipt } from '@nimiq/core'
import { Entropy } from '@nimiq/utils'

console.log('Starting Nimiq client...')

// This is the Testnet Faucet URL
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
    
    // Generate sender wallet
    const senderEntropy = Entropy.generate()
    const senderWallet = {
      keyPair: KeyPair.derive(senderEntropy),
      address: Address.derive(senderEntropy)
    }
    
    console.log('🎉 Sender wallet created!')
    console.log('Sender Address:', senderWallet.address.toUserFriendlyAddress())
    
    // Request funds from faucet for sender
    console.log('💧 Requesting funds from faucet...')
    await requestFundsFromFaucet(senderWallet.address)
    
    // Wait for funds to arrive
    await new Promise(resolve => setTimeout(resolve, 10000))
    
    // Check sender balance
    let senderBalance = await client.getBalance(senderWallet.address)
    console.log('Sender Balance:', Policy.lunasToCoins(senderBalance), 'NIM')
    
    if (senderBalance === 0) {
      console.log('⏳ No funds received yet. Faucet transaction might still be processing.')
      return
    }
    
    // Generate recipient wallet
    const recipientEntropy = Entropy.generate()
    const recipientAddress = Address.derive(recipientEntropy)
    
    console.log('👤 Recipient address:', recipientAddress.toUserFriendlyAddress())
    
    // TODO: Create a transaction
    
    // TODO: Sign the transaction
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
