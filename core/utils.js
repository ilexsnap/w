export const utils = {
  // Format phone number
  formatPhone(number) {
    return number.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  },
  
  // Check if user is admin in group
  async isAdmin(sock, groupId, userId) {
    try {
      const groupMetadata = await sock.groupMetadata(groupId);
      const participant = groupMetadata.participants.find(p => p.id === userId);
      return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch {
      return false;
    }
  },
  
  // Get random element from array
  random(array) {
    return array[Math.floor(Math.random() * array.length)];
  },
  
  // Sleep function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // Extract mentions from message
  extractMentions(text) {
    const mentionRegex = /@(\d+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1] + '@s.whatsapp.net');
    }
    
    return mentions;
  },
  
  // Format time
  formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  },
  
  // Check if message is from owner
  isOwner(jid, ownerNumber) {
    return jid === ownerNumber;
  },
  
  // Get file extension
  getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }
};
