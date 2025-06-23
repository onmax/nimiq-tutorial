import {
  Client,
} from '@nimiq/core'

console.log('🚀 Starting Nimiq Cashlink Generator...')

// Connect to the Nimiq testnet
const client = new Client('wss://testnet.v2.nimiq-rpc.com')

// Master secret for cashlink generation
const MASTER_SECRET = null
const TOKEN_LENGTH = 8

client.addConsensusChangedListener((state) => {
  console.log(`📡 Consensus state: ${state}`)

  if (state === 'established') {
    console.log('✅ Connected to Nimiq testnet!')
    console.log('🏗️ Ready to build cashlinks...\n')

    // Add your cashlink generator code here
  }
})

// Handle errors
client.addErrorListener((error) => {
  console.error('❌ Connection error:', error)
})
