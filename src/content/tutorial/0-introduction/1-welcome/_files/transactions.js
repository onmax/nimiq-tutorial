import { Address, Policy, Transaction, TransactionReceipt } from '@nimiq/core'
import { createAndConnectClient } from './lib/consensus.js'
import { requestFundsFromFaucet, waitForFunds } from './lib/faucet.js'
import { createRandomWallet } from './lib/wallet.js'

async function main() {
  // Create client and connect to network
  const client = await createAndConnectClient()

  // Generate sender wallet
  const senderWallet = createRandomWallet()
  console.log('🎉 Sender wallet created!')
  console.log('📍 Sender Address:', senderWallet.address.toUserFriendlyAddress())

  // Request funds from faucet
  await requestFundsFromFaucet(senderWallet.address)
  await waitForFunds(client, senderWallet.address)

  const senderBalance = await client.getBalance(senderWallet.address)
  console.log('💰 Sender Balance:', Policy.lunasToCoins(senderBalance), 'NIM')
  if (senderBalance === 0) {
    console.log('⏳ No funds received yet. Faucet transaction might still be processing.')
    return
  }

  // Generate recipient wallet
  const recipientAddress = Address.derive(crypto.getRandomValues(new Uint8Array(32)))
  console.log('👤 Recipient address:', recipientAddress.toUserFriendlyAddress())

  // Create and sign transaction
  const transaction = new Transaction(
    senderWallet.address,
    recipientAddress,
    Policy.coinsToLunas(1),
    Policy.coinsToLunas(0.00001),
    client.headHash,
    Transaction.Flag.NONE,
  )
  const signature = senderWallet.keyPair.sign(transaction.serializeContent())
  const proof = TransactionReceipt.singleSig(senderWallet.keyPair.publicKey, signature)
  transaction.proof = proof.serialize()
  console.log('✍️ Transaction signed successfully!')

  // Send transaction
  console.log('📤 Sending transaction...')
  const txHash = await client.sendTransaction(transaction)
  console.log('✅ Transaction sent! Hash:', txHash.toHex())

  // Wait for confirmation
  const receipt = await client.waitForTransactionReceipt(txHash, 60000)
  if (receipt) {
    console.log('🎉 Transaction confirmed in block:', receipt.blockHeight)
    // Check final balances
    const newSenderBalance = await client.getBalance(senderWallet.address)
    const recipientBalance = await client.getBalance(recipientAddress)
    console.log('📊 Final balances:')
    console.log('  👤 Sender:', Policy.lunasToCoins(newSenderBalance), 'NIM')
    console.log('  🏆 Recipient:', Policy.lunasToCoins(recipientBalance), 'NIM')
  }
}

main().catch(console.error)
