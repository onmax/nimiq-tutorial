import { Client, ClientConfiguration } from '@nimiq/core'

async function main() {
  console.log('🚀 Starting Nimiq Web Client Tutorial')
  
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
  
  // Get and log the current block height
  const headBlock = await client.getHeadBlock()
  console.log(`📊 Current block height: ${headBlock.height}`)
  console.log(`🧱 Head block hash: ${headBlock.hash}`)
  console.log(`⏰ Head block timestamp: ${new Date(headBlock.timestamp * 1000)}`)
  
  const networkId = await client.getNetworkId()
  console.log(`🌐 Connected to network: ${networkId}`)
}

main().catch(console.error) 
