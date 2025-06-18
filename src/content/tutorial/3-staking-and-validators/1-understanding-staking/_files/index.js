import { Client, ClientConfiguration, Policy } from '@nimiq/core'

console.log('🚀 Starting Nimiq Staking Tutorial')

async function main() {
  try {
    // Create a configuration builder
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
    
    // Instantiate and launch the client
    console.log('📡 Creating client and connecting to network...')
    const client = await Client.create(config.build())
    
    // Wait for consensus to be established
    console.log('⏳ Waiting for consensus to be established...')
    await client.waitForConsensusEstablished()
    
    console.log('✅ Consensus established!')
    
    // TODO: Get staking information
    // TODO: Calculate current epoch and blocks
    // TODO: Get validators and analyze staking metrics
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main().catch(console.error) 
