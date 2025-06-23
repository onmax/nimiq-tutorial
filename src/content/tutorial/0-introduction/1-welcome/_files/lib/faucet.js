const FAUCET_URL = 'https://faucet.pos.nimiq-testnet.com/tapit'

export async function requestFundsFromFaucet(address) {
  const response = await fetch(FAUCET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: address.toUserFriendlyAddress(), withStackingContract: false }),
  })
  if (!response.ok)
    throw new Error(`Faucet request failed: ${response.status}`)
  return response.json()
}

export async function waitForFunds(client, address, waitTime = 3000) {
  await new Promise(resolve => setTimeout(resolve, waitTime))
  return await client.getBalance(address)
}
