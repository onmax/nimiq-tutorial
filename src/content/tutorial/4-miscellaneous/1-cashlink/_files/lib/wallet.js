import { requestFromFaucet } from './faucet.js'
import { PrivateKey, KeyPair } from '@nimiq/core'

/**
 * Returns a wallet with funds
 */
export async function getFundedWallet(client) {
  // Generate a new wallet

  // ⚠️ Uncomment this when the faucet is working again
  // Get funds from faucet (from previous lessons)
  // await requestFromFaucet(client, address)

  // ⚠️ At the moment we cannot use the faucet, so we need to use a private key that has funds
  const privateKey = PrivateKey.fromHex('204aec9a093c8eb99d5136f9aa0910dd131934287035d03c7b9d5b2a6db042e3')

  // const privateKey = PrivateKey.generate()
  const keyPair = KeyPair.derive(privateKey)
  const address = keyPair.toAddress()

  // await requestFromFaucet(client, address)

  console.log('🎉 Wallet created!')
  console.log('📍 Address:', address.toUserFriendlyAddress())

  const account = await client.getAccount(address)
  console.log('💰 Balance:', account.balance / 1e5, 'NIM')

  return keyPair
}
