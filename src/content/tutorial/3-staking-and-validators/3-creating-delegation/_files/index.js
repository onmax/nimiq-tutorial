/**
 * Nimiq Staking Tutorial - Creating Delegation
 * 
 * Learn how to create and send delegation transactions to validators
 */

import * as Nimiq from '@nimiq/core'
import { createAndConnectClient, getNetworkInfo } from './client.js'
import { createWallet } from './wallet.js'
import { requestFromFaucet } from './faucet.js'
import { getActiveValidators, createDelegationTransaction } from './staking.js'
import { fetchValidators } from './validators-api.js'

console.log('🚀 Welcome to Delegation Tutorial!')

async function main() {
  try {
    // Connect to the network
    const client = await createAndConnectClient('TestAlbatross')
    const { blockHeight } = await getNetworkInfo(client)
    
    // Step 1: Create a wallet for delegation
    console.log('\n👛 Step 1: Creating wallet for delegation...')
    const wallet = createWallet()
    console.log(`Wallet Address: ${wallet.address.toUserFriendlyAddress()}`)
    
    // Step 2: Get some testnet funds
    console.log('\n🚰 Step 2: Requesting testnet funds...')
    await requestFromFaucet(wallet.address.toUserFriendlyAddress())
    
    // Wait a moment for the transaction to be processed
    console.log('⏳ Waiting for funds to arrive...')
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Check balance
    const account = await client.getAccount(wallet.address)
    const balanceNIM = Nimiq.Policy.lunasToCoins(account.balance)
    console.log(`💰 Current Balance: ${balanceNIM.toFixed(2)} NIM`)
    
    if (account.balance < Nimiq.Policy.coinsToLunas(100)) {
      console.log('⚠️  Insufficient funds for delegation. Need at least 100 NIM.')
      return
    }
    
    // Step 3: Choose a validator
    console.log('\n🏛️  Step 3: Selecting a validator for delegation...')
    const networkValidators = await getActiveValidators(client)
    const apiValidators = await fetchValidators('testnet')
    
    // Find a good validator (with low fee if available)
    let selectedValidator = networkValidators[0] // Default to first validator
    
    const validatorWithLowFee = apiValidators.find(v => 
      v.fee !== undefined && v.fee < 0.05 // Less than 5% fee
    )
    
    if (validatorWithLowFee) {
      // Find the corresponding network validator
      const networkValidator = networkValidators.find(nv => 
        nv.address.toUserFriendlyAddress() === validatorWithLowFee.address
      )
      if (networkValidator) {
        selectedValidator = networkValidator
        console.log(`✅ Selected validator with low fee: ${validatorWithLowFee.name || 'Unknown'}`)
        console.log(`   Fee: ${(validatorWithLowFee.fee * 100).toFixed(2)}%`)
      }
    } else {
      console.log('ℹ️  Using first available validator (no fee data available)')
    }
    
    console.log(`🎯 Validator Address: ${selectedValidator.address.toUserFriendlyAddress()}`)
    console.log(`💰 Validator Stake: ${Nimiq.Policy.lunasToCoins(selectedValidator.numStakers).toFixed(2)} NIM`)
    
    // Step 4: Create delegation transaction
    console.log('\n📝 Step 4: Creating delegation transaction...')
    const delegationAmount = Nimiq.Policy.coinsToLunas(100) // Delegate 100 NIM
    
    const delegationTx = createDelegationTransaction(
      wallet,
      selectedValidator.address,
      delegationAmount,
      blockHeight
    )
    
    console.log('Transaction Details:')
    console.log(`  Amount: ${Nimiq.Policy.lunasToCoins(delegationAmount)} NIM`)
    console.log(`  Fee: ${Nimiq.Policy.lunasToCoins(delegationTx.fee)} NIM`)
    console.log(`  To: Staking Contract`)
    console.log(`  Validator: ${selectedValidator.address.toUserFriendlyAddress()}`)
    
    // Step 5: Sign and send transaction
    console.log('\n✍️  Step 5: Signing transaction...')
    const signature = Nimiq.Signature.create(
      wallet.keyPair.privateKey,
      wallet.keyPair.publicKey,
      delegationTx.serializeContent()
    )
    delegationTx.signature = signature
    
    console.log('📡 Sending delegation transaction...')
    const txHash = await client.sendTransaction(delegationTx)
    console.log(`✅ Transaction sent! Hash: ${txHash.toHex()}`)
    
    // Step 6: Monitor transaction status
    console.log('\n⏳ Step 6: Monitoring transaction status...')
    console.log('Waiting for transaction confirmation...')
    
    // Wait for transaction to be included in a block
    let confirmed = false
    let attempts = 0
    const maxAttempts = 10
    
    while (!confirmed && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      try {
        const txReceipt = await client.getTransactionReceiptByHash(txHash)
        if (txReceipt) {
          console.log(`🎉 Transaction confirmed in block ${txReceipt.blockNumber}!`)
          confirmed = true
        }
      } catch (error) {
        // Transaction not yet confirmed
      }
      
      attempts++
      if (!confirmed) {
        console.log(`⏳ Still waiting... (${attempts}/${maxAttempts})`)
      }
    }
    
    if (!confirmed) {
      console.log('⚠️  Transaction taking longer than expected. Check manually.')
    }
    
    console.log('\n🎯 What happens next:')
    console.log('  • Your delegation becomes active in the next epoch')
    console.log('  • You start earning rewards automatically')
    console.log('  • Rewards are compounded each epoch')
    console.log('  • You can unstake anytime (with ~14 day delay)')
    
    console.log('\n✅ Delegation tutorial completed!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

main().catch(console.error) 
