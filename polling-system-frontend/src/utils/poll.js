export const isActive = (poll) => {
  if (!poll.expiresAt) return true;
  return new Date(poll.expiresAt) > new Date();
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTimeRemaining = (expiresAt) => {
  if (!expiresAt) return 'No expiry';
  
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry - now;
  
  // If expired
  if (diffMs < 0) {
    const absDiffMs = Math.abs(diffMs);
    const totalMinutes = Math.floor(absDiffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return minutes > 0 
        ? `Expired ${hours}h ${minutes}m ago` 
        : `Expired ${hours}h ago`;
    }
    return `Expired ${minutes}m ago`;
  }
  
  // If not expired, show remaining time
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return minutes > 0 
      ? `Expires in ${hours}h ${minutes}m` 
      : `Expires in ${hours}h`;
  }
  if (minutes > 0) return `Expires in ${minutes}m`;
  return 'Expiring soon';
};