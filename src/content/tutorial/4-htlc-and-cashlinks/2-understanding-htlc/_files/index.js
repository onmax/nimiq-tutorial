// HTLC exploration logic for tutorial
// This file focuses on inspecting an HTLC contract, demonstrating secrets/hashes, and checking network state.
// No network or wallet setup is included here.

import { HashedTimeLockedContract } from '@nimiq/core'

// Step 1: Demonstrate HTLC concepts
function demonstrateHTLCConcepts() {
  const secret = 'Hello Nimiq HTLC!'
  console.log('Secret:', secret)
  const secretBytes = new TextEncoder().encode(secret)
  console.log('Secret as bytes:', Array.from(secretBytes))
  console.log('Hash concept: The HTLC stores a hash of this secret')
  console.log('To claim: Provide the preimage (secret) that matches the hash')
  console.log('If timeout: Funds return to sender automatically')
}

// Step 2: Explore an HTLC contract (requires a connected client)
async function exploreHTLC(address, client) {
  console.log(`Exploring HTLC at address: ${address}`)
  try {
    const account = await client.getAccount(address)
    if (account.type === 'htlc') {
      console.log('Found HTLC Contract!')
      console.log('├─ Balance:', account.balance / 1e5, 'NIM')
      console.log('├─ Sender:', account.sender)
      console.log('├─ Recipient:', account.recipient)
      console.log('├─ Hash Root:', account.hashRoot)
      console.log('├─ Hash Algorithm:', account.hashAlgorithm)
      console.log('├─ Hash Count:', account.hashCount)
      console.log('├─ Timeout:', account.timeout)
      console.log('└─ Total Amount:', account.totalAmount / 1e5, 'NIM')
    } else {
      console.log('This is not an HTLC contract')
    }
  } catch (error) {
    console.error('Error exploring HTLC:', error.message)
  }
}

// Step 3: Check network state (requires a connected client)
async function checkNetworkState(client) {
  try {
    const head = await client.getHeadBlock()
    console.log('Current Block Height:', head.height)
    console.log('Block Timestamp:', new Date(head.timestamp * 1000).toLocaleString())
    const futureTimeout = head.height + 1000
    console.log(`Example HTLC timeout: Block ${futureTimeout}`)
  } catch (error) {
    console.error('Error getting network state:', error.message)
  }
}

// Example usage (after connecting to the network):
demonstrateHTLCConcepts()
// await checkNetworkState(client)
// await exploreHTLC('NQxx ...', client)

// HTLC demo: create, fund, and watch a real testnet cashlink
// WARNING: Testnet only! Never use real funds or mainnet for experiments.

import { CryptoUtils, Hash, KeyPair, PrivateKey, TransactionBuilder } from '@nimiq/core'
import { createAndConnectClient } from './lib/consensus.js'

async function main() {
  // Connect to the Nimiq testnet using the utility
  const client = await createAndConnectClient()
  console.log('✅ Connected to Nimiq testnet!')

  // Generate a new wallet (for demo only)
  const privateKey = PrivateKey.generate()
  const keyPair = KeyPair.derive(privateKey)
  const senderAddress = keyPair.toAddress().toUserFriendlyAddress()
  console.log('🔑 Sender Address:', senderAddress)

  // Generate a random secret
  const secret = btoa(String.fromCharCode(...CryptoUtils.getRandomBytes(32)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  console.log('🔐 Secret:', secret)

  // Hash the secret
  const secretBytes = new TextEncoder().encode(secret)
  const hashRoot = Hash.sha256(secretBytes)

  // Get current block height
  const head = await client.getHeadBlock()
  const timeout = head.height + 1000 // ~1000 blocks from now
  // Build HTLC contract data
  const htlcData = {
    sender: senderAddress,
    recipient: senderAddress, // Anyone with secret can claim
    hashRoot: hashRoot.toHex(),
    hashAlgorithm: 'sha256',
    hashCount: 1,
    timeout
  }
  // Build and sign the transaction
  const tx = new TransactionBuilder()
    .sender(keyPair.toAddress())
    .recipient(keyPair.toAddress()) // Placeholder; real contract address is created by the network
    .value(100000) // 1 NIM (in Luna)
    .flag(2) // CREATE_HTLC
    .data(htlcData)
    .build()
  keyPair.signTransaction(tx)
  // Send the transaction
  const txHash = await client.sendTransaction(tx)
  console.log('🚀 Sent HTLC transaction! Hash:', txHash)
  // Display the cashlink URL
  const url = new URL('https://hub.nimiq.com/cashlink/#' + senderAddress)
  url.hash += `&s=${encodeURIComponent(secret)}`
  console.log('🌐 Cashlink URL:', url.toString())
  console.log('👉 Open this URL in https://hub.nimiq-testnet.com/ to redeem!')
  // Start watching the HTLC
  watchHTLC(senderAddress, client)
}

// Watch the blockchain for HTLC state changes
function watchHTLC(address, client) {
  let lastState = null
  setInterval(async () => {
    const account = await client.getAccount(address)
    if (account.type === 'htlc') {
      if (lastState !== 'active') {
        console.log('🔒 HTLC is still active. Balance:', account.balance / 1e5, 'NIM')
        lastState = 'active'
      }
    } else {
      if (lastState !== 'gone') {
        console.log('🎉 HTLC claimed or expired!')
        lastState = 'gone'
      }
    }
  }, 10000) // Poll every 10 seconds
}

main()
