import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://smart-bus-tracking-aan6.onrender.com'); // Ensure this matches your server API URL

// Premium React Component for the Admin/Student Web Dashboard
const ReactETACard = ({ busId, targetStopId }) => {
  const [etaDetails, setEtaDetails] = useState({ distanceKm: 0, etaMinutes: 0 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Join the unified bus room to receive global route updates
    socket.emit('join_bus', { busId });

    // 2. Listen to ETA updates and actively filter for OUR target stop
    socket.on('eta_update', (data) => {
      if (data.stopId === targetStopId) {
        setEtaDetails({
          distanceKm: parseFloat(data.distanceKm),
          etaMinutes: data.etaMinutes,
        });

        // Calculate progress logic (Assuming 10km is max distance tracking for full bar)
        const maxDistance = 10; 
        const calcProgress = Math.max(0, 100 - (data.distanceKm / maxDistance) * 100);
        setProgress(calcProgress);
      }
    });

    return () => {
      socket.off('eta_update');
    };
  }, [busId, targetStopId]);

  return (
    <div style={styles.cardContainer}>
      <h3 style={styles.title}>Live Bus Tracker</h3>
      
      <div style={styles.dataContainer}>
        <div style={styles.dataBlock}>
          <span style={styles.label}>ETA</span>
          <span style={styles.value}>{etaDetails.etaMinutes} min</span>
        </div>
        <div style={styles.dataBlock}>
          <span style={styles.label}>Distance</span>
          <span style={styles.value}>{etaDetails.distanceKm.toFixed(1)} km</span>
        </div>
      </div>

      {/* Dynamic Animated Distance Bar */}
      <div style={styles.barBackground}>
        <div 
          style={{
            ...styles.barFill,
            width: `${Math.min(100, Math.max(0, progress))}%`, // Bound between 0 and 100
            backgroundColor: progress > 80 ? '#22c55e' : '#3b82f6' // Turn green when very close
          }} 
        />
      </div>
      <p style={styles.footerText}>
        {progress > 95 ? "Arriving Now!" : "Bus is on the way..."}
      </p>
    </div>
  );
};

// Vanilla JavaScript Object Styling for maximum flexibility (Premium UI)
const styles = {
  cardContainer: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    maxWidth: '350px',
    fontFamily: '"Inter", "Roboto", sans-serif',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  title: {
    margin: '0 0 20px 0',
    color: '#1e293b',
    fontSize: '20px',
    fontWeight: '700'
  },
  dataContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  dataBlock: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '12px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '600'
  },
  value: {
    fontSize: '28px',
    color: '#0f172a',
    fontWeight: '800'
  },
  barBackground: {
    height: '12px',
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.8s ease-out, background-color 0.5s ease',
  },
  footerText: {
    marginTop: '12px',
    fontSize: '14px',
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500'
  }
};

export default ReactETACard;
