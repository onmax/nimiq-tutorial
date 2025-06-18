import { Client, ClientConfiguration, Policy } from '@nimiq/core'

async function main() {
  console.log('🚀 Starting Nimiq Validator Explorer')
  
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
  
  // TODO: Get all validators
  // TODO: Analyze validator data (active, inactive, stake amounts)
  // TODO: Show top validators by stake
  // TODO: Calculate decentralization metrics
}

main().catch(console.error) 
