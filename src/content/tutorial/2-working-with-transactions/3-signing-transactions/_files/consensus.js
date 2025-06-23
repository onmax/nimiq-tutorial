/**
 * This file contains the functionality to connect to the Nimiq network.
 * You can learn how we do this in the tutorial "Connecting to the Network".
 */

import { Client, ClientConfiguration } from '@nimiq/core'

/**
 * Setup and establish consensus with the Nimiq network
 * This file handles the client initialization so the main index.js
 * can focus on the specific learning objectives
 */
export async function setupConsensus() {
  try {
    console.log('🚀 Setting up Nimiq client...')

    // Create client configuration
    const config = new ClientConfiguration()
    config.network('TestAlbatross')

    // Set seed nodes for testnet
    config.seedNodes([
      '/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed2.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed3.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed4.pos.nimiq-testnet.com/tcp/8443/wss',
    ])

    // Use pico sync for faster connection
    config.syncMode('pico')

    // Minimal logging
    config.logLevel('error')

    // Create and connect to the Nimiq network
    const client = await Client.create(config.build())
    console.log('⏳ Client created, waiting for consensus...')

    // Wait for consensus to be established
    await client.waitForConsensusEstablished()
    console.log('✅ Consensus established!')

    return client
  }
  catch (error) {
    console.error('❌ Failed to establish consensus:', error)
    throw error
  }
}
