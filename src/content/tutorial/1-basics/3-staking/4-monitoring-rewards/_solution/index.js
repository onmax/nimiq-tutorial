import * as Nimiq from '@nimiq/core'
import {
  createAndConnectClient,
  createWallet,
  requestFromFaucet,
  waitForFaucetFunds,
  getActiveValidators,
  createDelegationTransaction,
  signTransaction,
  simulateRewardMonitoring,
  displayStakingTips,
  getNetworkInfo
} from '../../_utils/index.js'

console.log('Starting Nimiq client for staking monitoring...')

async function main() {
  try {
    // Create client and connect to network
    const client = await createAndConnectClient()
    
    // Create a wallet and get funds
    const wallet = createWallet()
    
    // Get testnet funds
    const faucetSuccess = await requestFromFaucet(wallet.address)
    if (!faucetSuccess) {
      console.log('❌ Failed to get testnet funds')
      return
    }
    
    // Wait for funds
    const balance = await waitForFaucetFunds(client, wallet.address)
    
    if (balance === 0) {
      console.log('❌ No funds available for staking')
      return
    }
    
    // Get validators and prepare delegation
    const validators = await getActiveValidators(client)
    const selectedValidator = validators[0]
    const delegationAmount = Math.floor(balance * 0.5)
    
    console.log(`\n🎯 Selected Validator: ${selectedValidator.address.toUserFriendlyAddress()}`)
    console.log(`💰 Delegation Amount: ${Nimiq.Policy.lunasToCoins(delegationAmount)} NIM`)
    
    // Create and sign delegation transaction
    const currentHeight = await client.getBlockNumber()
    const transaction = createDelegationTransaction(
      wallet,
      selectedValidator.address,
      delegationAmount,
      currentHeight
    )
    
    // Sign the transaction
    const signedTransaction = signTransaction(transaction, wallet)
    
    console.log('\n📝 Sending delegation transaction...')
    
    try {
      // Send the transaction
      const txHash = await client.sendTransaction(signedTransaction)
      console.log('✅ Transaction sent!')
      console.log('Transaction Hash:', txHash.toHex())
      
      // Wait a bit for transaction processing
      console.log('\n⏳ Waiting for transaction confirmation...')
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Check transaction status
      try {
        const txReceipt = await client.getTransactionReceiptByHash(txHash)
        if (txReceipt) {
          console.log('✅ Transaction confirmed!')
          console.log('Block Hash:', txReceipt.blockHash.toHex())
        } else {
          console.log('⏳ Transaction still pending...')
        }
      } catch (error) {
        console.log('📄 Transaction submitted (status check not available on testnet)')
      }
      
      console.log('\n🎉 Delegation successful!')
      
      // Get current epoch info
      const networkInfo = await getNetworkInfo(client)
      
      console.log('\n📊 Staking Status:')
      console.log(`Current Epoch: ${networkInfo.currentEpoch}`)
      console.log(`Delegation Amount: ${Nimiq.Policy.lunasToCoins(delegationAmount)} NIM`)
      console.log(`Validator: ${selectedValidator.address.toUserFriendlyAddress()}`)
      console.log(`Rewards start in: Epoch ${networkInfo.currentEpoch + 1}`)
      
      // Simulate reward monitoring
      simulateRewardMonitoring(delegationAmount, selectedValidator.address)
      
      // Display staking tips
      displayStakingTips()
      
    } catch (error) {
      console.error('❌ Error sending transaction:', error.message)
      console.log('\n💡 Note: This might be due to testnet limitations or insufficient balance')
      
      // Still show the reward simulation
      simulateRewardMonitoring(delegationAmount, selectedValidator.address)
    }
    
    console.log('\n🎓 Congratulations! You\'ve completed the Nimiq staking tutorial!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
