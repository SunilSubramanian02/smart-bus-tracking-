import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import io from 'socket.io-client';

const socket = io('YOUR_SERVER_IP:5000'); // Note: For Android Emulator, use 10.0.2.2 instead of localhost

// Mobile React Native Component for the Student/Parent App
const ReactNativeETACard = ({ busId, targetStopId }) => {
  const [etaDetails, setEtaDetails] = useState({ distanceKm: 0, etaMinutes: 0 });
  
  // Using React Native Animated API for smooth iOS/Android native bar transitions
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Join the designated bus room
    socket.emit('join_bus', { busId });

    // 2. Listen natively to incoming updates
    socket.on('eta_update', (data) => {
      // Ensure we only render data belonging to this exact stop
      if (data.stopId === targetStopId) {
        setEtaDetails({
          distanceKm: parseFloat(data.distanceKm),
          etaMinutes: data.etaMinutes,
        });

        // Shrinking Progress logic (Max tracking = 10km)
        const maxDistance = 10;
        const calcProgress = Math.max(0, 100 - (data.distanceKm / maxDistance) * 100);

        // Natively animate the bar whenever backend emits an update!
        Animated.timing(animatedWidth, {
          toValue: calcProgress,
          duration: 1000, 
          useNativeDriver: false // Width animation doesn't natively support useNativeDriver in React Native
        }).start();
      }
    });

    return () => {
      socket.off('eta_update');
    };
  }, [busId, targetStopId, animatedWidth]);

  // Interpolate width percentage
  const barWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  // Dynamic colors based on proximity
  const barColor = animatedWidth.interpolate({
    inputRange: [0, 80, 100],
    outputRange: ['#3b82f6', '#3b82f6', '#22c55e'] 
  });

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>Live Bus Tracker</Text>
      
      <View style={styles.dataContainer}>
        <View style={styles.dataBlock}>
          <Text style={styles.label}>ETA</Text>
          <Text style={styles.value}>{etaDetails.etaMinutes} min</Text>
        </View>
        <View style={styles.dataBlock}>
          <Text style={styles.label}>DISTANCE</Text>
          <Text style={styles.value}>{etaDetails.distanceKm.toFixed(1)} km</Text>
        </View>
      </View>

      {/* Dynamic Animated Distance Bar */}
      <View style={styles.barBackground}>
        <Animated.View 
          style={[
            styles.barFill, 
            { width: barWidth, backgroundColor: barColor }
          ]} 
        />
      </View>

      <Text style={styles.footerText}>
        {etaDetails.distanceKm < 0.5 ? "Arriving Now!" : "Bus is on the way..."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dataBlock: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  barBackground: {
    height: 12,
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  footerText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  }
});

export default ReactNativeETACard;
