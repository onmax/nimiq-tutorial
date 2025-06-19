import { Client, HashedTimeLockedContract } from '@nimiq/core'

console.log('🚀 Starting Nimiq HTLC Explorer...')

// Connect to the Nimiq testnet
const client = new Client('wss://testnet.v2.nimiq-rpc.com')

// Explore HTLC structure
async function exploreHTLC(address) {
    console.log(`🔍 Exploring HTLC at address: ${address}`)
    
    try {
        const account = await client.getAccount(address)
        console.log('📊 Account Type:', account.type)
        
        if (account.type === 'htlc') {
            console.log('🎯 Found HTLC Contract!')
            console.log('├─ Balance:', account.balance / 1e5, 'NIM')
            console.log('├─ Sender:', account.sender)
            console.log('├─ Recipient:', account.recipient)
            console.log('├─ Hash Root:', account.hashRoot)
            console.log('├─ Hash Algorithm:', account.hashAlgorithm)
            console.log('├─ Hash Count:', account.hashCount)
            console.log('├─ Timeout:', account.timeout)
            console.log('└─ Total Amount:', account.totalAmount / 1e5, 'NIM')
        } else {
            console.log('❌ This is not an HTLC contract')
        }
    } catch (error) {
        console.error('❌ Error exploring HTLC:', error.message)
    }
}

// Demonstrate HTLC concepts
function demonstrateHTLCConcepts() {
    console.log('\n🧠 HTLC Concepts Demonstration:')
    
    // Generate a sample secret
    const secret = 'Hello Nimiq HTLC!'
    console.log('🔐 Secret:', secret)
    
    // Convert to bytes and hash it
    const secretBytes = new TextEncoder().encode(secret)
    console.log('📊 Secret as bytes:', Array.from(secretBytes))
    
    // This is what would be stored in the HTLC hash root
    // (In real implementation, this would use proper crypto hashing)
    console.log('🔗 Hash concept: The HTLC stores a hash of this secret')
    console.log('✅ To claim: Provide the secret that matches the hash')
    console.log('⏰ If timeout: Funds return to sender automatically')
}

// Check network state
async function checkNetworkState() {
    console.log('\n🌐 Network State:')
    
    try {
        const head = await client.getHeadBlock()
        console.log('📏 Current Block Height:', head.height)
        console.log('⏰ Block Timestamp:', new Date(head.timestamp * 1000).toLocaleString())
        
        // Example timeout calculation
        const futureTimeout = head.height + 1000 // 1000 blocks in the future
        console.log(`🔮 Example HTLC timeout: Block ${futureTimeout}`)
        console.log('   (Approximately 1000 minutes from now)')
    } catch (error) {
        console.error('❌ Error getting network state:', error.message)
    }
}

// Run the HTLC exploration
async function runHTLCExploration() {
    console.log('🚀 Starting HTLC Exploration...\n')
    
    // Demonstrate HTLC concepts
    demonstrateHTLCConcepts()
    
    // Check network state
    await checkNetworkState()
    
    // Try to explore a sample HTLC address (this might not exist)
    console.log('\n🔍 Attempting to find HTLC contracts...')
    console.log('(Most addresses will be basic accounts, not HTLCs)')
    
    // In a real scenario, you'd have actual HTLC addresses to explore
    // For now, we'll just demonstrate the concept
}

client.addConsensusChangedListener((state) => {
    console.log(`📡 Consensus state: ${state}`)
    
    if (state === 'established') {
        console.log('✅ Connected to Nimiq testnet!')
        console.log('🔍 Ready to explore HTLCs...\n')
        
        // Execute after connection is established
        runHTLCExploration()
    }
})

// Handle errors
client.addErrorListener((error) => {
    console.error('❌ Connection error:', error)
}) 
