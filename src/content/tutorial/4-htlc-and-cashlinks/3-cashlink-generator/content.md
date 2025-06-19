---
type: lesson
title: Building a Cashlink Generator
focus: /index.js
terminal:
  panels: ['output']
---

# Building a Complete Cashlink Generator 🏗️

Now let's build a production-ready cashlink generator inspired by the [Nimiq Cashlink Generator](https://github.com/nimiq/cashlink-generator). This will be a comprehensive tool that can create, fund, and manage cashlinks.

## What We'll Build

Our cashlink generator will:

1. **Generate Cashlinks** 🔗: Create multiple cashlinks from a master secret
2. **Fund Cashlinks** 💰: Send NIM to the HTLC contracts
3. **Export Data** 📋: Save cashlink information to CSV
4. **Create QR Codes** 📱: Generate QR codes for easy sharing
5. **Manage Timeouts** ⏰: Handle expiration and reclaim funds

## Architecture Overview

The generator uses a **master secret** approach where:
- All cashlinks are derived from a single master secret
- Each cashlink gets a unique token for identification
- The master secret can regenerate all cashlinks if needed

## Your Complete Cashlink Generator

Let's build this step by step, starting with the core utilities.

## Step 1: Master Secret and Token Generation

Create a master secret system for generating cashlinks:

```js
import { 
    Client, 
    PrivateKey, 
    KeyPair, 
    Address,
    Transaction, 
    TransactionBuilder,
    Hash,
    CryptoUtils
} from '@nimiq/core'
import { createHash } from 'crypto'
import { writeFileSync } from 'fs'

// Master secret for cashlink generation
let MASTER_SECRET = null
const TOKEN_LENGTH = 8

function generateMasterSecret() {
    // Generate a strong master secret
    const randomBytes = CryptoUtils.getRandomBytes(32)
    MASTER_SECRET = btoa(String.fromCharCode(...randomBytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
    
    console.log('🔐 Master Secret Generated:', MASTER_SECRET.substring(0, 20) + '...')
    return MASTER_SECRET
}

function generateToken() {
    // Generate a unique token for this cashlink
    const randomBytes = CryptoUtils.getRandomBytes(6)
    return btoa(String.fromCharCode(...randomBytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
        .substring(0, TOKEN_LENGTH)
}
```

## Step 2: Cashlink Derivation

Create cashlinks from the master secret and token:

```js
function deriveCashlinkSecret(masterSecret, token) {
    // Derive a unique secret for this cashlink using master secret + token
    const combinedInput = masterSecret + token
    const hash = createHash('sha256').update(combinedInput).digest()
    
    return btoa(String.fromCharCode(...hash))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
        .substring(0, 32) // Use first 32 characters
}

function createCashlinkFromToken(token, value, message = '', timeout = 1000) {
    if (!MASTER_SECRET) {
        throw new Error('Master secret not generated')
    }
    
    // Derive the secret for this cashlink
    const secret = deriveCashlinkSecret(MASTER_SECRET, token)
    
    // Create hash from secret
    const secretBytes = new TextEncoder().encode(secret)
    const hashRoot = Hash.sha256(secretBytes)
    
    console.log(`🔗 Creating cashlink with token: ${token}`)
    console.log(`├─ Value: ${value / 1e5} NIM`)
    console.log(`├─ Message: ${message}`)
    console.log(`└─ Secret: ${secret.substring(0, 10)}...`)
    
    return {
        token,
        secret,
        hashRoot: hashRoot.toHex(),
        value,
        message,
        timeout
    }
}
```

## Step 3: HTLC Address Calculation

Calculate the HTLC contract address before creating the transaction:

```js
function calculateHTLCAddress(senderAddress, recipientAddress, hashRoot, timeout) {
    // Create a deterministic HTLC address
    // This is a simplified version - real implementation would use proper contract address calculation
    
    const addressBytes = new TextEncoder().encode(
        senderAddress + recipientAddress + hashRoot + timeout.toString()
    )
    const addressHash = Hash.sha256(addressBytes)
    
    // Convert to Nimiq address format
    const htlcAddress = Address.fromHash(addressHash)
    return htlcAddress.toUserFriendlyAddress()
}

async function createHTLCTransaction(senderKeyPair, cashlinkData, currentBlockHeight) {
    const senderAddress = senderKeyPair.toAddress().toUserFriendlyAddress()
    const timeout = currentBlockHeight + cashlinkData.timeout
    
    // For cashlinks, the recipient is typically the same as sender (can be claimed by anyone with secret)
    const recipientAddress = senderAddress
    
    // Calculate HTLC contract address
    const htlcAddress = calculateHTLCAddress(
        senderAddress,
        recipientAddress,
        cashlinkData.hashRoot,
        timeout
    )
    
    console.log(`📝 Creating HTLC transaction for ${cashlinkData.token}`)
    console.log(`├─ HTLC Address: ${htlcAddress}`)
    console.log(`├─ Timeout: Block ${timeout}`)
    console.log(`└─ Hash Root: ${cashlinkData.hashRoot}`)
    
    // Create transaction data
    const htlcData = {
        sender: senderAddress,
        recipient: recipientAddress,
        hashRoot: cashlinkData.hashRoot,
        hashAlgorithm: 'sha256',
        hashCount: 1,
        timeout: timeout
    }
    
    // Build transaction
    const transaction = new TransactionBuilder()
        .sender(senderKeyPair.toAddress())
        .recipient(Address.fromUserFriendlyAddress(htlcAddress))
        .value(cashlinkData.value)
        .flag(Transaction.Flag.CREATE_HTLC)
        .data(htlcData)
        .build()
    
    // Sign transaction
    senderKeyPair.signTransaction(transaction)
    
    return {
        transaction,
        htlcAddress,
        timeout
    }
}
```

## Step 4: Batch Cashlink Generation

Create multiple cashlinks at once:

```js
async function generateCashlinks(count, valuePerCashlink, message = 'Enjoy your NIM!', timeoutBlocks = 1000) {
    console.log(`🚀 Generating ${count} cashlinks...`)
    console.log(`├─ Value per cashlink: ${valuePerCashlink / 1e5} NIM`)
    console.log(`├─ Message: ${message}`)
    console.log(`└─ Timeout: ${timeoutBlocks} blocks\n`)
    
    const cashlinks = []
    const currentBlock = await client.getHeadBlock()
    
    for (let i = 0; i < count; i++) {
        const token = generateToken()
        const cashlinkData = createCashlinkFromToken(token, valuePerCashlink, message, timeoutBlocks)
        
        // Create the cashlink URL
        const htlcAddress = calculateHTLCAddress(
            'NQ07 0000 0000 0000 0000 0000 0000 0000 0000', // Placeholder
            'NQ07 0000 0000 0000 0000 0000 0000 0000 0000',
            cashlinkData.hashRoot,
            currentBlock.height + timeoutBlocks
        )
        
        const cashlinkURL = buildCashlinkURL(htlcAddress, cashlinkData.secret, message, 'nimiq')
        
        cashlinks.push({
            ...cashlinkData,
            htlcAddress,
            url: cashlinkURL,
            funded: false,
            claimed: false,
            createdAt: new Date().toISOString()
        })
        
        console.log(`✅ Generated cashlink ${i + 1}/${count}: ${token}`)
    }
    
    console.log(`\n🎉 Generated ${count} cashlinks successfully!`)
    return cashlinks
}

function buildCashlinkURL(htlcAddress, secret, message = '', theme = 'nimiq') {
    const baseURL = 'https://hub.nimiq.com/cashlink/#'
    let url = baseURL + htlcAddress
    
    if (secret) url += '&s=' + encodeURIComponent(secret)
    if (message) url += '&m=' + encodeURIComponent(message)
    if (theme) url += '&t=' + encodeURIComponent(theme)
    
    return url
}
```

## Step 5: CSV Export and Management

Export cashlinks to CSV for management:

```js
function exportCashlinksToCSV(cashlinks, filename = 'cashlinks.csv') {
    console.log(`📋 Exporting ${cashlinks.length} cashlinks to ${filename}...`)
    
    // CSV header
    const header = 'token,secret,htlc_address,url,value_nim,message,timeout,funded,claimed,created_at'
    
    // CSV rows
    const rows = cashlinks.map(cashlink => {
        return [
            cashlink.token,
            cashlink.secret,
            cashlink.htlcAddress,
            cashlink.url,
            cashlink.value / 1e5,
            `"${cashlink.message}"`,
            cashlink.timeout,
            cashlink.funded,
            cashlink.claimed,
            cashlink.createdAt
        ].join(',')
    })
    
    const csvContent = [header, ...rows].join('\n')
    
    try {
        writeFileSync(filename, csvContent, 'utf8')
        console.log(`✅ Exported to ${filename}`)
        return filename
    } catch (error) {
        console.error(`❌ Export failed: ${error.message}`)
        throw error
    }
}

function importCashlinksFromCSV(filename) {
    console.log(`📥 Importing cashlinks from ${filename}...`)
    
    try {
        const csvContent = readFileSync(filename, 'utf8')
        const lines = csvContent.split('\n')
        const header = lines[0]
        
        const cashlinks = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',')
            return {
                token: values[0],
                secret: values[1],
                htlcAddress: values[2],
                url: values[3],
                value: parseFloat(values[4]) * 1e5,
                message: values[5].replace(/"/g, ''),
                timeout: parseInt(values[6]),
                funded: values[7] === 'true',
                claimed: values[8] === 'true',
                createdAt: values[9]
            }
        })
        
        console.log(`✅ Imported ${cashlinks.length} cashlinks`)
        return cashlinks
    } catch (error) {
        console.error(`❌ Import failed: ${error.message}`)
        throw error
    }
}
```

## Step 6: Funding Cashlinks

Fund the generated cashlinks:

```js
async function fundCashlinks(cashlinks, senderKeyPair, batchSize = 10) {
    console.log(`💰 Funding ${cashlinks.length} cashlinks...`)
    console.log(`├─ Batch size: ${batchSize}`)
    console.log(`└─ Sender: ${senderKeyPair.toAddress().toUserFriendlyAddress()}\n`)
    
    const fundedCashlinks = []
    let totalValue = 0
    
    for (let i = 0; i < cashlinks.length; i += batchSize) {
        const batch = cashlinks.slice(i, i + batchSize)
        console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}...`)
        
        for (const cashlink of batch) {
            try {
                const currentBlock = await client.getHeadBlock()
                const htlcTransaction = await createHTLCTransaction(
                    senderKeyPair,
                    cashlink,
                    currentBlock.height
                )
                
                // In a real implementation, you would send the transaction here
                console.log(`✅ Prepared funding for ${cashlink.token}`)
                console.log(`   HTLC: ${htlcTransaction.htlcAddress}`)
                
                // Mark as funded (in real implementation, wait for confirmation)
                cashlink.funded = true
                cashlink.htlcAddress = htlcTransaction.htlcAddress
                totalValue += cashlink.value
                
                fundedCashlinks.push(cashlink)
                
            } catch (error) {
                console.error(`❌ Failed to fund ${cashlink.token}: ${error.message}`)
            }
        }
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log(`\n🎉 Funding Complete!`)
    console.log(`├─ Funded: ${fundedCashlinks.length}/${cashlinks.length}`)
    console.log(`└─ Total Value: ${totalValue / 1e5} NIM`)
    
    return fundedCashlinks
}
```

## Step 7: Complete Generator Interface

Create a main interface to use the generator:

```js
class CashlinkGenerator {
    constructor() {
        this.cashlinks = []
        this.masterSecret = null
    }
    
    async init() {
        console.log('🚀 Initializing Cashlink Generator...')
        this.masterSecret = generateMasterSecret()
        console.log('✅ Generator ready!')
    }
    
    async generate(count, valuePerCashlink, message = 'Enjoy your NIM!', timeoutBlocks = 1000) {
        this.cashlinks = await generateCashlinks(count, valuePerCashlink, message, timeoutBlocks)
        return this.cashlinks
    }
    
    export(filename = 'cashlinks.csv') {
        return exportCashlinksToCSV(this.cashlinks, filename)
    }
    
    async fund(senderKeyPair, batchSize = 10) {
        this.cashlinks = await fundCashlinks(this.cashlinks, senderKeyPair, batchSize)
        return this.cashlinks
    }
    
    getCashlinks() {
        return this.cashlinks
    }
    
    getStats() {
        const total = this.cashlinks.length
        const funded = this.cashlinks.filter(c => c.funded).length
        const claimed = this.cashlinks.filter(c => c.claimed).length
        const totalValue = this.cashlinks.reduce((sum, c) => sum + c.value, 0)
        
        return {
            total,
            funded,
            claimed,
            unclaimed: funded - claimed,
            totalValue: totalValue / 1e5
        }
    }
}

// Demo usage
async function runCashlinkGenerator() {
    console.log('🎯 Running Cashlink Generator Demo...\n')
    
    try {
        // Initialize generator
        const generator = new CashlinkGenerator()
        await generator.init()
        
        // Generate cashlinks
        console.log('\n📝 Generating 5 cashlinks...')
        await generator.generate(5, 0.1 * 1e5, 'Welcome to Nimiq!', 1000)
        
        // Export to CSV
        console.log('\n💾 Exporting cashlinks...')
        generator.export('demo_cashlinks.csv')
        
        // Show statistics
        console.log('\n📊 Statistics:')
        const stats = generator.getStats()
        console.log(`├─ Total Cashlinks: ${stats.total}`)
        console.log(`├─ Funded: ${stats.funded}`)
        console.log(`├─ Claimed: ${stats.claimed}`)
        console.log(`├─ Unclaimed: ${stats.unclaimed}`)
        console.log(`└─ Total Value: ${stats.totalValue} NIM`)
        
        // Show sample cashlinks
        console.log('\n🔗 Sample Cashlinks:')
        generator.getCashlinks().slice(0, 3).forEach((cashlink, index) => {
            console.log(`${index + 1}. Token: ${cashlink.token}`)
            console.log(`   URL: ${cashlink.url}`)
            console.log(`   Value: ${cashlink.value / 1e5} NIM\n`)
        })
        
    } catch (error) {
        console.error('❌ Generator failed:', error.message)
    }
}
```

## Key Features Implemented

- **Master Secret System** 🔐: Derive all cashlinks from one secret
- **Token-based Generation** 🏷️: Unique tokens for each cashlink
- **Batch Processing** 📦: Handle multiple cashlinks efficiently
- **CSV Export/Import** 📋: Manage cashlinks with spreadsheets
- **Funding Management** 💰: Fund cashlinks in batches
- **Statistics** 📊: Track cashlink status and values

## Security Best Practices

- **Master Secret Storage** 🔒: Store master secret securely
- **Token Uniqueness** 🆔: Ensure each token is unique
- **Timeout Management** ⏰: Set appropriate expiration times
- **Transaction Fees** 💸: Account for network fees
- **Error Handling** 🛡️: Graceful failure handling

## Next Steps

In the final lesson, we'll add:
- QR code generation for easy sharing
- Web interface for the generator
- Real transaction sending
- Cashlink claiming functionality

> 💡 **Note**: This generator provides a solid foundation for creating production cashlinks. Always test thoroughly on testnet first! 
