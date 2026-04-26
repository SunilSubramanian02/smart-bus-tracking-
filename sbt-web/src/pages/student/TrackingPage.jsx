import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RotateCcw, Clock, Navigation, 
  MapPin, Activity, Wind, Zap, Globe, 
  Target, Crosshair, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapMockup from '../../components/Map';
import logo from '../../assets/logo.jpeg';
import collegeImg from '../../assets/college_ref.jpeg';

const TrackingPage = () => {
  const navigate = useNavigate();
  const [busLocation, setBusLocation] = useState(null);
  const [studentLocation, setStudentLocation] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState({
    speed: 42,
    eta: 8,
    dist: 1.2
  });

  // Target Location (Central Campus Base)
  const TARGET_NODE = { lat: 9.8300, lng: 78.0200 };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1));
  };

  useEffect(() => {
    // 1. Track Student Location
    let watchId;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setStudentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Student geolocation access denied or error:", error);
        },
        { enableHighAccuracy: true }
      );
    }

    // 2. Track Bus Location & Calculate Relative Distance
    const checkLocation = () => {
      const stored = localStorage.getItem('sbt_bus_07_location');
      if (stored) {
        const loc = JSON.parse(stored);
        setBusLocation(loc);
        
        // Dynamic calculations
        // Fallback to TARGET_NODE if student location is unavailable
        const targetLat = studentLocation?.lat || TARGET_NODE.lat;
        const targetLng = studentLocation?.lng || TARGET_NODE.lng;

        const dist = calculateDistance(loc.lat, loc.lng, targetLat, targetLng);
        const speedKmh = Math.round((loc.speed || 0) * 3.6);
        const displaySpeed = speedKmh > 0 ? speedKmh : 42; // mock speed if stationary
        const eta = Math.round((dist / displaySpeed) * 60) || 1;

        setStats({
          speed: displaySpeed,
          dist: dist,
          eta: eta
        });
      }
    };

    const interval = setInterval(checkLocation, 2000);
    checkLocation();

    return () => {
      clearInterval(interval);
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [studentLocation]);

  return (
    <div className="min-h-screen bg-slate-950 font-['Outfit',_sans-serif] flex flex-col overflow-hidden relative text-white">
       {/* Cinematic Background HUD */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img 
          src={collegeImg} 
          alt="College Background" 
          className="w-full h-full object-cover opacity-90 scale-105 grayscale-[0.1]"
        />
        
        {/* Dark Clarity Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/40 to-slate-950/80" />
        <div className="absolute inset-0 cyber-grid opacity-[0.05]" />
      </div>
       
       {/* Tactical HUD Header */}
       <header className="px-8 py-8 flex items-center justify-between relative z-50">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/student')}
            className="w-14 h-14 glass rounded-2xl flex items-center justify-center border border-slate-200 text-[#0b48a0] shadow-xl"
          >
             <ArrowLeft size={24} strokeWidth={3} />
          </motion.button>
          
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-1">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="w-1 h-3 bg-red-500 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                   ))}
                </div>
                <h1 className="font-black text-[10px] uppercase tracking-[0.5em] text-red-500 text-glow">Live Uplink Active</h1>
             </div>
             <p className="text-2xl font-black tracking-tighter flex items-center gap-3">
                <span className="text-white/40">SRM-07</span>
                <span className="text-blue-500 text-glow">TACTICAL RADAR</span>
             </p>
          </div>

          <motion.button 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-blue-600 rounded-[1.5rem] shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-white/20"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </motion.button>
       </header>

       {/* Floating Analytical HUD Chips */}
       <div className="px-8 grid grid-cols-3 gap-4 relative z-50 mt-2">
          <HUDChip icon={<Clock className="text-blue-400" />} label="EST. ARRIVAL" value={stats.eta} unit="MIN" />
          <HUDChip icon={<Target className="text-emerald-400" />} label="SPATIAL DIST" value={stats.dist} unit="KM" />
          <HUDChip icon={<Activity className="text-yellow-400" />} label="CURR VELOCITY" value={stats.spd} unit="KMH" />
       </div>

       {/* Immersive Tactical Viewport */}
       <div className="flex-1 mt-8 relative w-full px-6 pb-6">
          <div className="w-full h-full rounded-[4rem] overflow-hidden border border-white/10 relative shadow-[0_0_100px_rgba(0,0,0,0.8)]">
             <MapMockup busLocation={busLocation} />
             
             {/* Radar Scanning Visuals */}
             <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-blue-900/5" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square border border-white/5 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] aspect-square border border-white/5 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] aspect-square border border-white/5 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white/5 rotate-45" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white/5 -rotate-45" />
             </div>

             {/* Dynamic Location Tags */}
             <div className="absolute top-8 left-8 flex flex-col gap-3">
                <div className="glass-dark px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-white/10">
                   <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                   <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Quantum Telemetry Engaged</span>
                </div>
                <div className="glass-dark px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-white/10">
                   <Shield className="w-4 h-4 text-emerald-400" />
                   <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Secure Link v4.2 Stable</span>
                </div>
             </div>

             <div className="absolute bottom-8 right-8">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-blue-600 text-white p-6 rounded-[2.5rem] flex items-center gap-5 shadow-[0_20px_50px_rgba(37,99,235,0.4)] border border-white/20 backdrop-blur-xl"
                >
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                     <Crosshair className="w-6 h-6 text-yellow-300 animate-spin-slow" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Primary Objective</p>
                      <p className="text-sm font-black tracking-tight">CENTRAL CAMPUS BASE</p>
                   </div>
                </motion.div>
             </div>
          </div>
       </div>

       {/* Navigational Control Panel */}
       <div className="px-8 pb-10 relative z-50">
          <div className="glass-dark p-8 rounded-[3.5rem] border border-white/10 shadow-3xl backdrop-blur-3xl overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px]" />
             
             <div className="flex justify-between items-end relative z-10">
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]" />
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Next Coordinate Target</p>
                   </div>
                   <h3 className="text-4xl font-black text-white leading-none tracking-tighter">MAIN ENTRANCE <br /> NODE</h3>
                   <div className="flex items-center gap-3 mt-4">
                      <span className="px-4 py-1.5 bg-blue-600/10 text-blue-400 text-[10px] font-black rounded-full border border-blue-400/20 uppercase tracking-widest">500M to Point</span>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Sync Probability</p>
                   <p className="text-5xl font-black text-white tracking-tighter leading-none">99.8%</p>
                   <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-2 flex items-center justify-end gap-2">
                     <Globe size={12} /> On Optimal Path
                   </p>
                </div>
             </div>

             <motion.button 
               onClick={() => setIsExpanded(!isExpanded)}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full mt-10 py-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-black text-sm rounded-[2rem] shadow-3xl border border-white/10 transition-all flex items-center justify-center gap-4 group uppercase tracking-[0.2em]"
             >
                {isExpanded ? 'COLLAPSE TACTICAL DATA' : 'EXPAND TACTICAL DATA'} <Navigation className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
             </motion.button>

             <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-6"
                  >
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                        <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2"><Activity size={14} className="text-blue-400" /> Advanced Telemetry</p>
                        
                        {/* Live OSM Map View */}
                        <div className="w-full h-48 rounded-2xl overflow-hidden mb-5 border border-white/10 relative shadow-inner">
                           <iframe 
                             src={`https://www.openstreetmap.org/export/embed.html?bbox=${(busLocation?.lng || 78.1198) - 0.0025}%2C${(busLocation?.lat || 9.9252) - 0.0025}%2C${(busLocation?.lng || 78.1198) + 0.0025}%2C${(busLocation?.lat || 9.9252) + 0.0025}&layer=mapnik&marker=${busLocation?.lat || 9.9252}%2C${busLocation?.lng || 78.1198}`}
                             width="100%" 
                             height="100%" 
                             frameBorder="0" 
                             style={{ filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(110%)' }}
                             title="Live Bus Map"
                           ></iframe>
                        </div>

                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                              <span className="text-white/60 font-medium">Next Checkpoint</span>
                              <span className="font-black text-white text-right">MAIN ENTRANCE <br/><span className="text-[10px] text-blue-400">ETA: 2 MINS</span></span>
                           </div>
                           <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                              <span className="text-white/60 font-medium">Traffic Density</span>
                              <span className="font-black text-emerald-400 flex items-center gap-2"><Globe size={14}/> LOW (OPTIMAL)</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-white/60 font-medium">Engine Status</span>
                              <span className="font-black text-emerald-400">NOMINAL</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
       </div>

       {/* Screen Aesthetic Overlays */}
       <div className="fixed inset-0 pointer-events-none opacity-[0.05] scan-line z-[200]" />
       <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] z-[200]" />
    </div>
  );
};

const HUDChip = ({ icon, label, value, unit }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-dark p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center gap-2 group hover:neon-border transition-all shadow-xl"
  >
     <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">{icon}</div>
     <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{label}</p>
     <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-black text-white tracking-tighter text-glow">{value}</span>
        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{unit}</span>
     </div>
  </motion.div>
);

export default TrackingPage;
