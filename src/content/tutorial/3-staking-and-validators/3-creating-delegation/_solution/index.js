import * as Nimiq from '@nimiq/core'
import {
  createAndConnectClient,
  createWallet,
  requestFromFaucet,
  waitForFaucetFunds,
  getActiveValidators,
  createDelegationTransaction,
  signTransaction
} from '../../_utils/index.js'

console.log('Starting Nimiq client for staking delegation...')

async function main() {
  try {
    // Create client and connect to network
    const client = await createAndConnectClient()
    
    // Create a wallet
    const wallet = createWallet()
    
    // Request testnet funds
    const faucetSuccess = await requestFromFaucet(wallet.address)
    if (!faucetSuccess) {
      console.log('❌ Failed to get testnet funds')
      return
    }
    
    // Wait for funds to arrive
    const balance = await waitForFaucetFunds(client, wallet.address)
    
    if (balance === 0) {
      console.log('❌ No funds available for staking')
      return
    }
    
    // Get active validators
    const validators = await getActiveValidators(client)
    
    // Choose the first validator for delegation
    const selectedValidator = validators[0]
    console.log(`\n🎯 Selected validator: ${selectedValidator.address.toUserFriendlyAddress()}`)
    console.log(`   Current stake: ${Nimiq.Policy.lunasToCoins(selectedValidator.numStakers)} NIM`)
    
    // Calculate delegation amount (50% of balance)
    const delegationAmount = Math.floor(balance * 0.5)
    console.log(`\n💰 Delegation amount: ${Nimiq.Policy.lunasToCoins(delegationAmount)} NIM`)
    
    // Get current block height for transaction validity
    const currentHeight = await client.getBlockNumber()
    
    // Create the staking transaction
    const transaction = createDelegationTransaction(
      wallet,
      selectedValidator.address,
      delegationAmount,
      currentHeight
    )
    
    console.log('\n📝 Staking transaction created:')
    console.log('  From:', transaction.sender.toUserFriendlyAddress())
    console.log('  To:', transaction.recipient.toUserFriendlyAddress())
    console.log('  Delegation Amount:', Nimiq.Policy.lunasToCoins(transaction.value), 'NIM')
    console.log('  Fee:', Nimiq.Policy.lunasToCoins(transaction.fee), 'NIM')
    console.log('  Validator:', selectedValidator.address.toUserFriendlyAddress())
    
    // Sign the transaction
    const signedTransaction = signTransaction(transaction, wallet)
    
    console.log('\n✅ Transaction signed!')
    console.log('Signature:', signedTransaction.signature.toHex())
    
    // Verify the signature
    const isValid = signedTransaction.verify()
    console.log('🔐 Signature valid:', isValid)
    
    console.log('\n🎉 Delegation transaction ready!')
    console.log('💡 In the next lesson, we\'ll learn how to send this transaction and monitor rewards!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
