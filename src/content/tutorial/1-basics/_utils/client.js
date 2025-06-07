import * as Nimiq from '@nimiq/core'

/**
 * Utility functions for Nimiq client setup and network operations
 */

/**
 * Create and connect to the Nimiq network
 * @param {string} network - Network to connect to ('TestAlbatross' or 'MainAlbatross')
 * @returns {Promise<Nimiq.Client>} - Connected Nimiq client
 */
export async function createAndConnectClient(network = 'TestAlbatross') {
  console.log('Starting Nimiq client...')
  
  // Create client configuration
  const config = new Nimiq.ClientConfiguration()
  config.network(network)
  
  // Create the client instance
  const client = await Nimiq.Client.create(config.build())
  console.log('Client created, waiting for consensus...')
  
  // Wait for consensus
  await client.waitForConsensusEstablished()
  console.log('✅ Consensus established!')
  
  return client
}

/**
 * Get current network information
 * @param {Nimiq.Client} client - The Nimiq client
 * @returns {Promise<Object>} - Network information object
 */
export async function getNetworkInfo(client) {
  const currentBlock = await client.getHeadBlock()
  const currentEpoch = Math.floor(currentBlock.height / Nimiq.Policy.EPOCH_LENGTH)
  
  return {
    blockHeight: currentBlock.height,
    currentEpoch,
    epochLength: Nimiq.Policy.EPOCH_LENGTH
  }
}

/**
 * Display network information in a formatted way
 * @param {Nimiq.Client} client - The Nimiq client
 */
export async function displayNetworkInfo(client) {
  const info = await getNetworkInfo(client)
  
  console.log('📊 Network Information:')
  console.log('  Block height:', info.blockHeight)
  console.log('  Current epoch:', info.currentEpoch)
  console.log('  Blocks per epoch:', info.epochLength)
} 
