import * as Nimiq from '@nimiq/core'
import { Entropy } from '@nimiq/utils'

/**
 * Utility functions for wallet creation and management
 */

/**
 * Create a new wallet with entropy
 * @returns {Object} - Wallet object with keyPair and address
 */
export function createWallet() {
  const entropy = Entropy.generate()
  const wallet = {
    keyPair: Nimiq.KeyPair.derive(entropy),
    address: Nimiq.Address.derive(entropy)
  }
  
  console.log('🎉 Wallet created!')
  console.log('Address:', wallet.address.toUserFriendlyAddress())
  
  return wallet
}

/**
 * Create a wallet from existing entropy
 * @param {Entropy} entropy - Existing entropy
 * @returns {Object} - Wallet object with keyPair and address
 */
export function createWalletFromEntropy(entropy) {
  const wallet = {
    keyPair: Nimiq.KeyPair.derive(entropy),
    address: Nimiq.Address.derive(entropy)
  }
  
  return wallet
}

/**
 * Display wallet information
 * @param {Object} wallet - Wallet object
 */
export function displayWalletInfo(wallet) {
  console.log('👛 Wallet Information:')
  console.log('  Address:', wallet.address.toUserFriendlyAddress())
  console.log('  Public Key:', wallet.keyPair.publicKey.toHex())
}

/**
 * Create a basic transaction
 * @param {Object} wallet - Sender wallet
 * @param {Nimiq.Address} recipient - Recipient address
 * @param {number} value - Amount in Luna
 * @param {number} fee - Fee in Luna
 * @param {number} validityStartHeight - Current block height
 * @returns {Nimiq.Transaction} - Created transaction
 */
export function createBasicTransaction(wallet, recipient, value, fee, validityStartHeight) {
  return new Nimiq.Transaction(
    wallet.address,
    recipient,
    value,
    fee,
    validityStartHeight,
    Nimiq.Transaction.Type.BASIC
  )
}

/**
 * Sign a transaction with a wallet
 * @param {Nimiq.Transaction} transaction - Transaction to sign
 * @param {Object} wallet - Wallet to sign with
 * @returns {Nimiq.SignedTransaction} - Signed transaction
 */
export function signTransaction(transaction, wallet) {
  const signature = Nimiq.Signature.create(
    wallet.keyPair.privateKey,
    wallet.keyPair.publicKey,
    transaction.serializeContent()
  )
  
  return new Nimiq.SignedTransaction(transaction, signature)
} 
