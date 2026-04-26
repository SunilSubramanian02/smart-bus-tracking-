import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, Image, 
  SafeAreaView, Dimensions, ScrollView, Platform 
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { 
  Bus, Navigation, Clock, ShieldAlert, 
  MapPin, ChevronLeft, Bell 
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const TrackingScreen = () => {
  const [busLocation, setBusLocation] = useState({
    latitude: 9.9252,
    longitude: 78.1198,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft color="#1E40AF" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <Text style={styles.headerSubtitle}>SRM 07 • Active</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Bell color="#64748b" size={22} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Map Segment */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={busLocation}
          customMapStyle={mapStyle}
        >
          <Marker coordinate={busLocation}>
            <View style={styles.busMarker}>
              <Bus color="#fff" size={20} />
            </View>
          </Marker>
        </MapView>

        {/* Floating Speed Card */}
        <View style={styles.speedCard}>
           <Text style={styles.speedLabel}>SPEED</Text>
           <Text style={styles.speedValue}>42 <Text style={styles.speedUnit}>KM/H</Text></Text>
        </View>
      </View>

      {/* Info Panel - Absolute Bottom */}
      <View style={styles.infoPanel}>
        <View style={styles.dragBar} />
        
        <View style={styles.statsRow}>
           <StatBox icon={<Clock color="#1E40AF" size={20} />} label="ETA" value="05 min" />
           <StatBox icon={<Navigation color="#10B981" size={20} />} label="DISTANCE" value="1.2 km" />
           <StatBox icon={<Bus color="#F59E0B" size={20} />} label="STATUS" value="On Time" />
        </View>

        <View style={styles.nextStopCard}>
          <View style={styles.nextStopInfo}>
            <View style={styles.stopIconContainer}>
               <MapPin color="#1E40AF" size={20} />
            </View>
            <View>
              <Text style={styles.nextStopLabel}>NEXT STOP</Text>
              <Text style={styles.nextStopName}>Mattuthavani Gate</Text>
            </View>
          </View>
          <Text style={styles.nextStopTime}>08:50 AM</Text>
        </View>

        <TouchableOpacity style={styles.sosButton} activeOpacity={0.8}>
           <ShieldAlert color="#fff" size={24} />
           <Text style={styles.sosText}>EMERGENCY SOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const StatBox = ({ icon, label, value }) => (
  <View style={styles.statBox}>
     {icon}
     <Text style={styles.statLabel}>{label}</Text>
     <Text style={styles.statValue}>{value}</Text>
  </View>
);

const mapStyle = [/* Standard Clean Map Theme */];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
    textTransform: 'uppercase',
  },
  notifButton: {
    width: 40, height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10, right: 10,
    width: 8, height: 8,
    backgroundColor: '#ef4444',
    borderRadius: 4,
    borderWidth: 2, borderColor: '#fff'
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  busMarker: {
    backgroundColor: '#1E40AF',
    padding: 8,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#1E40AF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
  },
  speedCard: {
    position: 'absolute',
    top: 20, left: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  speedLabel: { fontSize: 8, fontWeight: '900', color: '#64748b', letterSpacing: 1 },
  speedValue: { fontSize: 24, fontWeight: '900', color: '#fff' },
  speedUnit: { fontSize: 10, color: '#64748b' },
  infoPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    paddingTop: 12,
    marginTop: -40,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
  },
  dragBar: {
    width: 40, height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 20,
    width: (width - 72) / 3,
  },
  statLabel: { fontSize: 8, fontWeight: '900', color: '#94a3b8', marginTop: 8, textTransform: 'uppercase' },
  statValue: { fontSize: 14, fontWeight: '900', color: '#1e293b', marginTop: 2 },
  nextStopCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  nextStopInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stopIconContainer: { padding: 8, backgroundColor: '#fff', borderRadius: 12 },
  nextStopLabel: { fontSize: 8, fontWeight: '900', color: '#94a3b8' },
  nextStopName: { fontSize: 16, fontWeight: '900', color: '#1E40AF' },
  sosButton: {
    backgroundColor: '#ef4444',
    height: 65,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#ef4444', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15,
  },
  sosText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});

export default TrackingScreen;
