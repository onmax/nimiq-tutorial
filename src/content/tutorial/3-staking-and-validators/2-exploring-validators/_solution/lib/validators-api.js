export async function getValidators(network = 'TestAlbatross') {
  try {
    const apiUrl = network === 'MainAlbatross' ? `https://validators-api-mainnet.pages.dev` : `https://validators-api-testnet.pages.dev`
    const response = await fetch(`${apiUrl}/api/v1/validators`)
    if (!response.ok) {
      throw new Error(`Failed to fetch validators: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  }
  catch (error) {
    console.error('Error fetching validators:', error)
    return []
  }
}

export async function getStakedSupplyRatio(network = 'TestAlbatross') {
  try {
    const apiUrl = network === 'MainAlbatross' ? `https://validators-api-mainnet.pages.dev` : `https://validators-api-testnet.pages.dev`
    const response = await fetch(`${apiUrl}/api/v1/supply`)
    if (!response.ok) {
      throw new Error(`Failed to fetch supply: ${response.statusText}`)
    }
    const data = await response.json()
    return data.staking / data.total
  }
  catch (error) {
    console.error('Error fetching validators:', error)
    return []
  }
}
