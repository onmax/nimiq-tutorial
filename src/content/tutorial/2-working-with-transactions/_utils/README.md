# Nimiq Tutorial Utilities

This directory contains reusable utility functions that help keep tutorial lesson files clean and focused on the core learning objectives.

## 📁 File Structure

```
_utils/
├── index.js          # Main export file - import all utilities from here
├── client.js         # Client connection and network utilities
├── wallet.js         # Wallet creation and transaction utilities
├── faucet.js         # Testnet faucet utilities
├── staking.js        # Staking-specific utilities
└── README.md         # This documentation file
```

## 🔧 Usage

Import utilities in your tutorial files:

```javascript
import {
  createAndConnectClient,
  createWallet,
  requestFromFaucet,
  // ... other functions
} from '../../_utils/index.js'
```

## 📦 Available Utilities

### Client Utilities (`client.js`)

- **`createAndConnectClient(network)`** - Create and connect to Nimiq network
- **`getNetworkInfo(client)`** - Get current block and epoch information
- **`displayNetworkInfo(client)`** - Display formatted network information

### Wallet Utilities (`wallet.js`)

- **`createWallet()`** - Create a new wallet with entropy
- **`createWalletFromEntropy(entropy)`** - Create wallet from existing entropy
- **`displayWalletInfo(wallet)`** - Display wallet information
- **`createBasicTransaction(...)`** - Create a basic transaction
- **`signTransaction(transaction, wallet)`** - Sign a transaction

### Faucet Utilities (`faucet.js`)

- **`requestFromFaucet(address)`** - Request testnet funds
- **`waitForFaucetFunds(client, address, waitTime)`** - Wait for funds and check balance

### Staking Utilities (`staking.js`)

- **`getActiveValidators(client)`** - Query active validators
- **`displayValidators(validators)`** - Display validator information
- **`createDelegationTransaction(...)`** - Create delegation transaction
- **`createUnstakingTransaction(...)`** - Create unstaking transaction
- **`simulateRewardMonitoring(...)`** - Simulate reward projections
- **`displayStakingTips()`** - Show staking best practices

## 🎯 Benefits

### Before Refactoring
```javascript
// 150+ lines of repetitive setup code
import * as Nimiq from '@nimiq/core'
import { Entropy } from '@nimiq/utils'

async function requestFromFaucet(address) {
  // 20+ lines of faucet logic
}

async function main() {
  // 30+ lines of client setup
  // 20+ lines of wallet creation
  // 25+ lines of transaction creation
  // Actual learning content buried in boilerplate
}
```

### After Refactoring
```javascript
// Clean, focused tutorial code
import * as Nimiq from '@nimiq/core'
import { createAndConnectClient, createWallet, requestFromFaucet } from '../../_utils/index.js'

async function main() {
  const client = await createAndConnectClient()
  const wallet = createWallet()
  await requestFromFaucet(wallet.address)
  
  // Focus on the actual learning objectives!
}
```

## 🔄 Refactoring Benefits

1. **Reduced Code Duplication** - Common functions written once, used everywhere
2. **Cleaner Tutorial Files** - Focus on learning objectives, not boilerplate
3. **Easier Maintenance** - Update utility once, affects all tutorials
4. **Better Readability** - Tutorial intent is immediately clear
5. **Consistent Behavior** - Same logic across all lessons

## 🚀 Functions Moved

These commonly repeated functions have been extracted:

### High-Impact Moves
- **`requestFromFaucet()`** - Used in 6+ tutorial files
- **Client setup pattern** - Used in every tutorial
- **Wallet creation** - Used in 5+ tutorials
- **Transaction signing** - Used in 4+ tutorials

### Medium-Impact Moves
- **Validator querying** - Used in 3 staking tutorials
- **Network info display** - Used in multiple lessons
- **Reward simulation** - Staking-specific but reusable

## 💡 Usage Tips

1. **Import what you need** - Only import the functions you actually use
2. **Use descriptive imports** - Import names clearly indicate their purpose
3. **Check function signatures** - All functions are documented with JSDoc
4. **Consistent patterns** - Follow the same utility usage patterns across tutorials

This refactoring makes the tutorials much more maintainable and helps students focus on learning Nimiq concepts rather than wrestling with boilerplate code! 
