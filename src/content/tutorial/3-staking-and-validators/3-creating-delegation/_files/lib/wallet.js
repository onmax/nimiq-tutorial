import { KeyPair, Address, PrivateKey } from '@nimiq/core'
import { readFile, writeFile } from 'fs/promises'

/**
 * Utility functions for wallet creation and management
 */

/**
 * Create a new wallet
 * @returns {Promise<KeyPair>} - The key pair for the new wallet
 */
export async function createWallet() {
  const privateKey = PrivateKey.generate()
  const keyPair = KeyPair.derive(privateKey)
  return keyPair
}

/**
 * Get a wallet from stored private key, or create a new one
 * @returns {Promise<KeyPair>}
 */
export async function getWallet() {
  const privateKeyHex = await readFile('wallet.key', 'utf-8').catch(() => null)
  if (privateKeyHex) return KeyPair.derive(PrivateKey.fromHex(privateKeyHex))
  const privateKey = PrivateKey.generate()
  await writeFile('wallet.key', privateKey.toHex(), 'utf-8')
  return KeyPair.derive(privateKey)
}

/**
 * Display wallet information
 * @param {KeyPair} keyPair - Key pair of the wallet
 */
export function displayWalletInfo(keyPair) {
  console.log('👛 Wallet Information:')
  console.log('  Address:', keyPair.toAddress().toUserFriendlyAddress())
  console.log('  Public Key:', keyPair.publicKey.toHex())
}

/**
 * Create a basic transaction
 * @param {KeyPair} keyPair - Sender key pair
 * @param {Address} recipient - Recipient address
 * @param {number} value - Amount in Luna
 * @param {number} fee - Fee in Luna
 * @param {number} validityStartHeight - Current block height
 * @returns {Transaction} - Created transaction
 */
export function createBasicTransaction(keyPair, recipient, value, fee, validityStartHeight) {
  return new Transaction(
    keyPair.toAddress(),
    recipient,
    value,
    fee,
    validityStartHeight,
  )
}

/**
 * Create a wallet from existing entropy
 * @param {Uint8Array|import('@nimiq/core').PrivateKey} entropy - Existing entropy
 * @returns {Object} - Wallet object with keyPair and address
 */
export function createWalletFromEntropy(entropy) {
  const wallet = {
    keyPair: KeyPair.derive(entropy),
    address: Address.derive(entropy)
  }
  
  return wallet
}

/**
 * Sign a transaction with a wallet
 * @param {Transaction} transaction - Transaction to sign
 * @param {KeyPair} keyPair - Key pair of the wallet
 * @returns {SignedTransaction} - Signed transaction
 */
export function signTransaction(transaction, keyPair) {
  const signature = Signature.create(
    keyPair.privateKey,
    keyPair.publicKey,
    transaction.serializeContent()
  )
  
  return new SignedTransaction(transaction, signature)
} 
