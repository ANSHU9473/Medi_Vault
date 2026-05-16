'use client';
import { useState } from 'react';
import { MapPin, Phone, AlertTriangle } from 'lucide-react';

export default function EmergencyButton() {
  const [loadingLoc, setLoadingLoc] = useState(false);
  
  const handleEmergency = () => {
    setLoadingLoc(true);
    
    // Open the tab synchronously to prevent popup blockers
    const newWindow = window.open('about:blank', '_blank');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const targetUrl = `https://www.google.com/maps/search/hospitals+near+me/@${latitude},${longitude},14z`;
        if (newWindow) newWindow.location.href = targetUrl;
        else window.location.href = targetUrl; // Fallback
        setLoadingLoc(false);
      }, () => {
        const fallbackUrl = 'https://www.google.com/maps/search/hospitals+near+me';
        if (newWindow) newWindow.location.href = fallbackUrl;
        else window.location.href = fallbackUrl;
        setLoadingLoc(false);
      }, { timeout: 8000 });
    } else {
      const fallbackUrl = 'https://www.google.com/maps/search/hospitals+near+me';
      if (newWindow) newWindow.location.href = fallbackUrl;
      else window.location.href = fallbackUrl;
      setLoadingLoc(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleEmergency}
        disabled={loadingLoc}
        className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white border border-red-600/30 rounded-full font-medium text-sm transition-all disabled:opacity-50"
        title="Find & Call Nearby Hospital"
      >
        {loadingLoc ? <AlertTriangle className="animate-spin" size={18} /> : <MapPin className="animate-bounce" size={18} />}
        <span className="hidden sm:inline">{loadingLoc ? 'Locating You...' : 'Call Nearby Hospital'}</span>
      </button>
    </div>
  );
}
