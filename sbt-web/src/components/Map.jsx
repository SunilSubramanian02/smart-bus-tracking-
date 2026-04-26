import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';

const MapMockup = ({ busLocation }) => {
  const [liveLocation, setLiveLocation] = useState(busLocation || { lat: 9.9252, lng: 78.1198 });

  // Sync with prop if it changes
  useEffect(() => {
    if (busLocation) setLiveLocation(busLocation);
  }, [busLocation]);

  // Listen for real-time global socket broadcasts
  useEffect(() => {
    const socket = io(SOCKET_URL);
    
    socket.on('location_update', (data) => {
      if (data.lat && data.lng) {
        setLiveLocation({ lat: data.lat, lng: data.lng, speed: data.speed });
      }
    });

    return () => socket.disconnect();
  }, []);

  const lat = liveLocation.lat;
  const lng = liveLocation.lng;
  const zoomFactor = 0.0025; // Controls zoom level (smaller is more zoomed in)

  return (
    <div className="w-full h-full bg-slate-900 relative">
      <iframe 
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - zoomFactor}%2C${lat - zoomFactor}%2C${lng + zoomFactor}%2C${lat + zoomFactor}&layer=mapnik&marker=${lat}%2C${lng}`}
        width="100%" 
        height="100%" 
        frameBorder="0" 
        style={{ filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(110%)' }}
        title="Live Transport Map"
      ></iframe>
      
      {/* Decorative Overlay for HUD effect */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]" />
    </div>
  );
};

export default React.memo(MapMockup);
