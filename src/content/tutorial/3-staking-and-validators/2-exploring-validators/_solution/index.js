/**
 * Nimiq Tutorial Utilities
 * 
 * This module exports commonly used functions across the tutorial lessons
 * to keep the main tutorial files clean and focused on learning objectives.
 */

// Client utilities
export {
  createAndConnectClient,
  getNetworkInfo,
  displayNetworkInfo
} from './client.js'

// Wallet utilities
export {
  createWallet,
  createWalletFromEntropy,
  displayWalletInfo,
  createBasicTransaction,
  signTransaction
} from './wallet.js'

// Faucet utilities
export {
  requestFromFaucet,
  waitForFaucetFunds
} from './faucet.js'

// Staking utilities
export {
  getActiveValidators,
  displayValidators,
  createDelegationTransaction,
  createUnstakingTransaction,
  simulateRewardMonitoring,
  displayStakingTips
} from './staking.js'

// Validators API utilities
export {
  getValidatorsApiUrl,
  fetchValidatorsFromApi,
  fetchValidatorFromApi,
  fetchSupplyFromApi,
  displayValidatorApiInfo,
  compareValidatorData,
  displayNetworkAnalytics
} from './validators-api.js' 
