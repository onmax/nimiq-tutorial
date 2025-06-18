import { Client, ClientConfiguration, Policy } from '@nimiq/core'

/**
 * Utility functions for Nimiq client setup and network operations
 */

/**
 * Create and connect to the Nimiq network
 * @param {string} network - Network to connect to ('TestAlbatross' or 'MainAlbatross')
 * @returns {Promise<Client>} - Connected Nimiq client
 */
export async function createAndConnectClient(network = 'TestAlbatross') {
  console.log('🚀 Starting Nimiq client...')
  
  // Create client configuration
  const config = new ClientConfiguration()
  // We can also use `MainAlbatross` for mainnet
  config.network(network)

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
  console.log('⏳ Client created, waiting for consensus...')
  
  // Wait for consensus
  await client.waitForConsensusEstablished()
  console.log('✅ Consensus established!')
  
  return client
}

/**
 * Get current network information
 * @param {Client} client - The Nimiq client
 * @returns {Promise<Object>} - Network information object
 */
export async function getNetworkInfo(client) {
  const headBlock = await client.getHeadBlock()
  const currentEpoch = Math.floor(headBlock.height / Policy.EPOCH_LENGTH)
  
  return {
    blockHeight: headBlock.height,
    currentEpoch,
    epochLength: Policy.EPOCH_LENGTH
  }
}

/**
 * Display network information in a formatted way
 * @param {Client} client - The Nimiq client
 */
export async function displayNetworkInfo(client) {
  const info = await getNetworkInfo(client)
  
  console.log('📊 Network Information:')
  console.log('  📊 Block height:', info.blockHeight)
  console.log('  📅 Current epoch:', info.currentEpoch)
  console.log('  🔢 Blocks per epoch:', info.epochLength)
} 
