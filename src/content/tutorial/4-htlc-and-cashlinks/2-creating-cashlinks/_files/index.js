import { 
    Client, 
    PrivateKey, 
    KeyPair, 
    Transaction, 
    TransactionBuilder,
    Hash,
    CryptoUtils
} from '@nimiq/core'

console.log('🚀 Starting Nimiq Cashlink Creator...')

// Connect to the Nimiq testnet
const client = new Client('wss://testnet.v2.nimiq-rpc.com')

client.addConsensusChangedListener((state) => {
    console.log(`📡 Consensus state: ${state}`)
    
    if (state === 'established') {
        console.log('✅ Connected to Nimiq testnet!')
        console.log('🔗 Ready to create cashlinks...\n')
        
        // Add your cashlink creation code here
        
    }
})

// Handle errors
client.addErrorListener((error) => {
    console.error('❌ Connection error:', error)
}) 
