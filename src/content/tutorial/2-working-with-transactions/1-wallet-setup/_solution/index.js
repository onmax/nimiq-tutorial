import { Client, ClientConfiguration, KeyPair, Address, Policy } from '@nimiq/core'
import { Entropy } from '@nimiq/utils'

console.log('Starting Nimiq client...')

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
    console.log('Public Key:', wallet.keyPair.publicKey.toHex())
    
    // Check wallet balance
    const balance = await client.getBalance(wallet.address)
    console.log('Balance:', Policy.lunasToCoins(balance), 'NIM')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
