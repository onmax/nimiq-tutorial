/**
 * Nimiq Validators API Utilities
 *
 * Minimal utilities for fetching validator data from the official API
 */

/**
 * Fetch validators data from the Nimiq Validators API
 * @param {string} network - 'mainnet' or 'testnet'
 * @returns {Promise<Array>} Array of validator data
 */
export async function fetchValidators(network = 'testnet') {
  const baseUrl = network === 'mainnet'
    ? 'https://validators-api-mainnet.pages.dev'
    : 'https://validators-api-testnet.pages.dev'
  const url = `${baseUrl}/api/v1/validators`
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`API request failed: ${response.status}`)
  const result = await response.json()
  return result.data || []
}

/**
 * Get base URL for the validators API based on network
 * @param {string} network - 'mainnet' or 'testnet'
 * @returns {string} Base URL for the API
 */
export function getValidatorsApiUrl(network = 'testnet') {
  const baseUrls = {
    mainnet: 'https://validators-api-mainnet.pages.dev',
    testnet: 'https://validators-api-testnet.pages.dev',
  }
  return baseUrls[network] || baseUrls.testnet
}

/**
 * Fetch all validators from the API
 * @param {string} network - 'mainnet' or 'testnet'
 * @param {object} options - Query parameters for filtering
 * @returns {Promise<object>} Validator data from API
 */
export async function fetchValidatorsFromApi(network = 'testnet', options = {}) {
  const baseUrl = getValidatorsApiUrl(network)
  const params = new URLSearchParams(options)
  const url = `${baseUrl}/api/v1/validators${params.toString() ? `?${params.toString()}` : ''}`

  try {
    console.log(`🌐 Fetching validators from API: ${url}`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  }
  catch (error) {
    console.error('❌ Error fetching validators from API:', error.message)
    throw error
  }
}

/**
 * Fetch specific validator information from the API
 * @param {string} validatorAddress - Validator address
 * @param {string} network - 'mainnet' or 'testnet'
 * @returns {Promise<object>} Validator information
 */
export async function fetchValidatorFromApi(validatorAddress, network = 'testnet') {
  const baseUrl = getValidatorsApiUrl(network)
  const url = `${baseUrl}/api/v1/validators/${validatorAddress}`

  try {
    console.log(`🌐 Fetching validator ${validatorAddress} from API`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  }
  catch (error) {
    console.error('❌ Error fetching validator from API:', error.message)
    throw error
  }
}

/**
 * Fetch supply information from the API
 * @param {string} network - 'mainnet' or 'testnet'
 * @returns {Promise<object>} Supply data
 */
export async function fetchSupplyFromApi(network = 'testnet') {
  const baseUrl = getValidatorsApiUrl(network)
  const url = `${baseUrl}/api/v1/supply`

  try {
    console.log(`🌐 Fetching supply information from API`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  }
  catch (error) {
    console.error('❌ Error fetching supply from API:', error.message)
    throw error
  }
}

/**
 * Display enhanced validator information from API
 * @param {object} validatorData - Validator data from API
 */
export function displayValidatorApiInfo(validatorData) {
  console.log('\n🔍 Enhanced Validator Information:')
  console.log(`📛 Name: ${validatorData.name || 'N/A'}`)
  console.log(`📍 Address: ${validatorData.address}`)
  console.log(`📝 Description: ${validatorData.description || 'N/A'}`)

  if (validatorData.website) {
    console.log(`🌐 Website: ${validatorData.website}`)
  }

  // Display trust score if available
  if (validatorData.trustScore !== undefined) {
    console.log(`⭐ Trust Score: ${validatorData.trustScore}`)
  }

  // Display fee information
  if (validatorData.fee !== undefined) {
    console.log(`💰 Fee: ${(validatorData.fee * 100).toFixed(2)}%`)
  }
  else if (validatorData.feeLowest !== undefined) {
    console.log(`💰 Fee Range: ${(validatorData.feeLowest * 100).toFixed(2)}% - ${(validatorData.feeHighest * 100).toFixed(2)}%`)
    if (validatorData.feeDescription) {
      console.log(`   Description: ${validatorData.feeDescription}`)
    }
  }

  // Display payout information
  if (validatorData.payoutType) {
    console.log(`💸 Payout Type: ${validatorData.payoutType}`)
    if (validatorData.payoutSchedule) {
      console.log(`   Schedule: ${validatorData.payoutSchedule}`)
    }
    if (validatorData.payoutScheme) {
      console.log(`   Scheme: ${validatorData.payoutScheme}`)
    }
  }

  // Display contact information
  if (validatorData.contact) {
    console.log('📞 Contact:')
    Object.entries(validatorData.contact).forEach(([key, value]) => {
      if (value) {
        console.log(`   ${key}: ${value}`)
      }
    })
  }
}

/**
 * Compare network data with API data
 * @param {Array} networkValidators - Validators from network query
 * @param {object} apiValidators - Validators from API
 */
export function compareValidatorData(networkValidators, apiValidators) {
  console.log('\n📊 Comparing Network vs API Data:')
  console.log(`🔗 Network validators: ${networkValidators.length}`)
  console.log(`🌐 API validators: ${apiValidators.data ? apiValidators.data.length : 'N/A'}`)

  if (apiValidators.data) {
    // Find validators with enhanced metadata
    const validatorsWithMetadata = apiValidators.data.filter(v =>
      v.name || v.description || v.website || v.contact,
    )

    console.log(`✨ Validators with enhanced metadata: ${validatorsWithMetadata.length}`)
    console.log(`📈 Metadata coverage: ${((validatorsWithMetadata.length / apiValidators.data.length) * 100).toFixed(1)}%`)
  }
}

/**
 * Display network analytics from API
 * @param {object} supplyData - Supply data from API
 */
export function displayNetworkAnalytics(supplyData) {
  if (!supplyData)
    return

  console.log('\n📈 Network Analytics:')

  if (supplyData.totalSupply) {
    console.log(`💎 Total Supply: ${supplyData.totalSupply.toLocaleString()} NIM`)
  }

  if (supplyData.circulatingSupply) {
    console.log(`🔄 Circulating Supply: ${supplyData.circulatingSupply.toLocaleString()} NIM`)
  }

  if (supplyData.totalStaked) {
    console.log(`🔒 Total Staked: ${supplyData.totalStaked.toLocaleString()} NIM`)
  }

  if (supplyData.stakingRatio) {
    console.log(`📊 Staking Ratio: ${(supplyData.stakingRatio * 100).toFixed(2)}%`)
  }
}
