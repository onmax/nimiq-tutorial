// These imports are node specific.
// You need to adapt it to your runtime.
import { TextEncoder } from 'node:util'
import { Buffer } from 'node:buffer'

import { Address, TransactionBuilder, CryptoUtils, Hash } from '@nimiq/core'

import { getFundedWallet } from './lib/wallet.js'
import { setupConsensus } from './lib/consensus.js'

/**
 * Returns 32 random bytes formatted as base 64
 */
function generateCashlinkSecret() {
  const bytes = CryptoUtils.getRandomValues(32)
  const secret = Buffer.from(bytes).toString('base64url')
  return secret
}

/**
 * Creates a hash from the secret using Nimiq's Hash utility
 */
function createHashFromSecret(secret) {
  const secretBytes = new TextEncoder().encode(secret)
  const hash = Hash.computeSha256(secretBytes)
  console.log('Hash', hash.toHex())
  return hash.toHex()
}

/**
 * Create and send HTLC transaction
 */
async function createAndSendHTLC(client, keyPair, hashRoot, value) {
  const senderAddress = keyPair.toAddress().toUserFriendlyAddress()

  // Get current block height for timeout
  const head = await client.getHeadBlock()
  const networkId = await client.getNetworkId()

  // After 100 blocks, the HTLC will be expired and the funds will be returned to the sender
  const timeoutBlocks = head.height + 100 // 100 blocks from now = 5 minutes

  // For cashlinks, recipient is typically the same as sender (can be claimed by anyone with secret)
  const recipientAddress = senderAddress

  // Create HTLC contract data
  const htlcData = {
    sender: senderAddress,
    recipient: recipientAddress,
    hashRoot: hashRoot,
    hashAlgorithm: 'sha256',
    hashCount: 1,
    timeout: timeoutBlocks,
    // message, You can also add a message to the HTLC contract which will be stored in the contract forever
  }

  // Build contract creation transaction (recipient is null)
  const tx = TransactionBuilder.newBasicWithData(
    keyPair.toAddress(),
    null,
    htlcData,
    BigInt(value),
    0n,
    head,
    networkId,
  )
  // Get the contract address
  const htlcAddress = tx.getContractCreationAddress().toUserFriendlyAddress()

  console.log('📝 Creating HTLC transaction...')
  console.log(`├─ HTLC Address: ${htlcAddress}`)
  console.log(`├─ Timeout: Block ${timeoutBlocks}`)
  console.log(`├─ Value: ${value / 1e5} NIM`)
  console.log(`└─ Hash Root: ${hashRoot}`)

  // Build transaction to fund the contract
  const transaction = TransactionBuilder.newBasicWithData(
    keyPair.toAddress(),
    htlcAddress,
    htlcData,
    BigInt(value),
    0n,
    head,
    networkId,
  )

  // Sign transaction
  keyPair.signTransaction(transaction)

  // Send transaction
  const txHash = await client.sendTransaction(transaction)
  console.log('🚀 Sent HTLC transaction! Hash:', txHash)

  return htlcAddress
}

/**
 * Creates a Cashlink URL
 */
function buildCashlinkURL(htlcAddress, secret, message, network = 'TestAlbatross') {
  const hubDomain = network === 'MainAlbatross' ? 'https://hub.nimiq.com/cashlink/#' : 'https://hub.nimiq-testnet.com/cashlink/#'

  const url = new URL(hubDomain + htlcAddress);
  if (secret)
    url.searchParams.append('s', secret)
  if (message)
    url.searchParams.append('m', message)

  console.log('Cashlink URL:', url.toString())
  return url.toString();
}

async function main() {
  try {
    const client = await setupConsensus()
    const keyPair = await getFundedWallet(client)

    // Generate cashlink components
    const secret = generateCashlinkSecret()
    const hashRoot = createHashFromSecret(secret)

    // Create and fund the HTLC with 1 NIM
    const value = 1e5 // 1 NIM in Luna
    const htlcAddress = await createAndSendHTLC(client, keyPair, hashRoot, value)

    // Build the cashlink URL
    const url = buildCashlinkURL(htlcAddress, secret, 'Enjoy your NIM!')

    console.log('\n🎉 Cashlink created successfully!')
    console.log(`Value: ${value / 1e5} NIM`)
    console.log('HTLC Address:', htlcAddress)
    console.log(`\n\n 👉 Share or open this URL with someone to let them claim the funds!\n${url}\n`)
    console.log('⏳ If unclaimed within ~5 minutes, the funds return to the faucet.')
  }
  catch (error) {
    console.error('❌ Error:', error.message)
  }
}

main()
