/**
 * Nimiq Staking Tutorial - Creating a Delegation
 *
 * This lesson demonstrates how to create a staking delegation transaction.
 */

import { Address } from '@nimiq/core'
import { createAndConnectClient } from './consensus.js'
import { getTestnetNIM } from './lib/faucet.js'
import { createDelegationTransaction, getActiveValidators, sendTransaction } from './lib/staking.js'
import { createWallet, getWallet } from './lib/wallet.js'

async function main() {
  console.log('🚀 Welcome to the Staking Delegation Creator!')

  // Connect to the client
  const client = await createAndConnectClient('TestAlbatross')

  // Create or load a wallet
  let wallet = await getWallet()
  if (!wallet) {
    wallet = await createWallet()
    console.log('✨ New wallet created')

    // Get some testnet NIM if the wallet is new
    await getTestnetNIM(wallet.address)
    console.log('💰 Got some testnet NIM from the faucet')
  }
  console.log(`🔑 Wallet address: ${wallet.address.toUserFriendlyAddress()}`)

  // Get active validators
  const validators = await getActiveValidators(client)

  // Choose a validator to delegate to (we'll just pick the first one)
  const validator = validators[0]
  const validatorAddress = Address.fromUserFriendlyAddress(validator.address.toUserFriendlyAddress())
  console.log(`🤝 Delegating to validator: ${validatorAddress.toUserFriendlyAddress()}`)

  // Create the delegation transaction
  const amount = 100 * 1e5 // 100 NIM
  const fee = 1000 // 0.01 NIM
  const validityStartHeight = (await client.getHeadBlock()).height
  const transaction = createDelegationTransaction(wallet, validatorAddress, amount, fee, validityStartHeight)
  console.log('📄 Created delegation transaction')

  // Send the transaction
  const txHash = await sendTransaction(client, transaction)
  console.log(`💸 Sent transaction with hash: ${txHash}`)

  console.log('✅ Delegation transaction created and sent!')
}

main().catch(console.error)
