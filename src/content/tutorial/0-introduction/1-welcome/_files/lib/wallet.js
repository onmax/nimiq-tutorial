import { Address, Entropy, KeyPair } from '@nimiq/core'

export function createWalletFromEntropy(entropy) {
  return {
    keyPair: KeyPair.derive(entropy),
    address: Address.derive(entropy),
  }
}

export function createRandomWallet() {
  const entropy = Entropy.generate()
  return createWalletFromEntropy(entropy)
}

export function displayWalletInfo(wallet) {
  console.log('📦 Wallet:')
  console.log('  Address:', wallet.address.toUserFriendlyAddress())
  console.log('  Public Key:', wallet.keyPair.publicKey.toHex())
}
