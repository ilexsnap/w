export const config = {
  // Bot Configuration
  botName: 'NeoxrBot',
  prefix: '.',
  ownerNumber: '923417033005@s.whatsapp.net', // Replace with your WhatsApp number
  
  // Session Configuration
  sessionName: 'neoxr-session',
  
  // Connection Method
  connectionMethod: 'pairing', // 'qr' or 'pairing'
  pairingNumber: '923417033005', // Phone number for pairing (without +)
  
  // Database Configuration
  database: {
    type: 'local', // 'local' or 'mongodb'
    mongodb: {
      uri: 'mongodb://localhost:27017/neoxrbot'
    }
  },
  
  // Auto Reply Settings
  autoReply: true,
  autoReplyMessage: 'Hello! I am a WhatsApp bot. Type .menu to see available commands.',
  
  // Group Settings
  allowGroups: true,
  allowPrivate: true,
  
  // Logging
  logLevel: 'info', // 'error', 'warn', 'info', 'debug'
  
  // Rate Limiting
  cooldown: 3000, // 3 seconds between commands per user
  
  // Feature Toggles
  features: {
    antiSpam: true,
    autoDownload: false,
    welcomeMessage: true,
    viewOnce: true
  }
};
