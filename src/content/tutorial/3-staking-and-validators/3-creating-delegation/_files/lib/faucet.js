/**
 * Utility functions for requesting testnet funds from the Nimiq faucet
 */

/**
 * Request testnet NIM from the faucet
 * @param {Nimiq.Address} address - The address to send funds to
 * @returns {Promise<boolean>} - Success status
 */
export async function getTestnetNIM(address) {
  const faucetUrl = 'https://faucet.pos.nimiq-testnet.com/tapit'
  const response = await fetch(faucetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `address=${address.toUserFriendlyAddress()}`,
  })
  if (!response.ok)
    throw new Error('Faucet request failed')
  return true
}

/**
 * Wait for faucet funds to arrive and check balance
 * @param {Nimiq.Client} client - The Nimiq client
 * @param {Nimiq.Address} address - The address to check
 * @param {number} waitTime - Time to wait in milliseconds (default: 5000)
 * @returns {Promise<number>} - The balance in Luna
 */
export async function waitForFaucetFunds(client, address, waitTime = 5000) {
  console.log('⏳ Waiting for funds to arrive...')
  await new Promise(resolve => setTimeout(resolve, waitTime))

  const balance = await client.getBalance(address)
  console.log('💰 Balance:', Nimiq.Policy.lunasToCoins(balance), 'NIM')

  return balance
}
