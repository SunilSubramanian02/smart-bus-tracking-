import React, { useState, useEffect } from 'react';
import { 
  MapPin, Users, AlertTriangle, ChevronRight, 
  Bus, Navigation, HelpCircle, Clock, 
  Wifi, Zap, Shield, Radio, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapMockup from '../../components/Map';
import logo from '../../assets/logo.jpeg';
import collegeImg from '../../assets/college_ref.jpeg';

const DriverInterface = () => {
  const [isLive, setIsLive] = useState(false);
  const [location, setLocation] = useState({ lat: 9.9252, lng: 78.1198 });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let watchId;
    if (isLive) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const newLoc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              speed: position.coords.speed || 0,
              timestamp: Date.now()
            };
            setLocation(newLoc);
            localStorage.setItem('sbt_bus_07_location', JSON.stringify(newLoc));
          },
          (error) => console.error("Error watching location:", error),
          { enableHighAccuracy: true }
        );
      } else {
        const interval = setInterval(() => {
          const mockLoc = {
            lat: 9.9252 + (Math.random() - 0.5) * 0.005,
            lng: 78.1198 + (Math.random() - 0.5) * 0.005,
            speed: 35 + Math.random() * 15,
            timestamp: Date.now()
          };
          setLocation(mockLoc);
          localStorage.setItem('sbt_bus_07_location', JSON.stringify(mockLoc));
        }, 2000);
        return () => clearInterval(interval);
      }
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isLive]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-['Outfit',_sans-serif] overflow-hidden relative selection:bg-yellow-400/30">
      {/* Cinematic Background HUD */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img 
          src={collegeImg} 
          className="w-full h-full object-cover opacity-90 scale-105 grayscale-[0.1]" 
          alt="College Background" 
        />
        
        {/* Dark Clarity Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/40 to-slate-950/80 pointer-events-none" />
        <div className="absolute inset-0 cyber-grid opacity-[0.05] pointer-events-none" />
      </div>

      {/* Top HUD Bar */}
      <header className="relative z-50 p-6 flex justify-between items-center bg-white/40 backdrop-blur-xl border-b border-black/5 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center font-black text-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-white/20">
              07
            </div>
            {isLive && (
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-1 bg-blue-500 rounded-2xl blur-md -z-10"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-black tracking-tight text-glow">NEURAL LINK SRM-07</h1>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-1 h-3 rounded-full ${isLive ? 'bg-blue-400 animate-pulse' : 'bg-white/10'}`} style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 shadow-[0_0_10px_#4ade80]' : 'bg-slate-500'}`} />
              <span className={isLive ? 'text-emerald-400' : 'text-slate-500'}>
                {isLive ? 'Transmitting Spatial Data' : 'System Standby'}
              </span>
            </p>
          </div>
        </div>

        <div className="text-right hidden md:block">
          <p className="text-3xl font-black tracking-tighter text-glow-yellow leading-none">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <div className="flex items-center justify-end gap-2 mt-1">
            <Wifi className={`w-3 h-3 ${isLive ? 'text-blue-400' : 'text-white/20'}`} />
            <Shield className="w-3 h-3 text-emerald-400/60" />
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">v4.2.1 Secure</p>
          </div>
        </div>
      </header>

      {/* Main Command Deck */}
      <main className="flex-1 flex flex-col lg:flex-row relative z-10 overflow-hidden">
        
        {/* Navigation & Spatial View */}
        <div className="flex-[2.5] relative group">
           <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
           <MapMockup busLocation={location} />
           
           {/* HUD Overlays */}
           <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent border-t-white/5 border-b-white/5" />
           
           {/* Speedometer HUD */}
           <motion.div 
             initial={{ x: -100, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             className="absolute bottom-10 left-10 p-8 glass-dark rounded-[3rem] border-l-4 border-l-blue-600 shadow-3xl pointer-events-auto"
           >
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                <Activity className="w-3 h-3" /> Velocity Vector
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black tracking-tighter text-glow">
                  {isLive ? Math.round(location.speed || 42) : 0}
                </span>
                <span className="text-sm font-bold text-white/40 uppercase tracking-widest">km/h</span>
              </div>
              <div className="mt-4 flex gap-1">
                 {Array.from({ length: 12 }).map((_, i) => (
                   <div 
                    key={i} 
                    className={`h-1 flex-1 rounded-full ${
                      (isLive && i < (location.speed / 5)) ? 'bg-blue-500 shadow-[0_0_10px_#2563eb]' : 'bg-white/5'
                    }`} 
                   />
                 ))}
              </div>
           </motion.div>

           {/* Objective HUD */}
           <motion.div 
             initial={{ y: -100, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="absolute top-10 right-10 left-10 md:left-auto md:w-96 glass-dark rounded-[2.5rem] p-8 border-t-4 border-t-yellow-400 shadow-3xl pointer-events-auto"
           >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em] mb-1">Target Node</p>
                  <h2 className="text-3xl font-black tracking-tight leading-none">MATTUTHAVANI</h2>
                </div>
                <div className="px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl text-yellow-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                  1.2 KM
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/40">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">ETA 08:50 AM</span>
                </div>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Link</span>
                </div>
              </div>
           </motion.div>
        </div>

        {/* Tactical Control Panel */}
        <aside className="flex-1 bg-white/[0.02] backdrop-blur-3xl border-l border-white/10 p-8 flex flex-col gap-8 overflow-y-auto">
          
          {/* Biometric/Boarding Panel */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Payload Status</h3>
               <Users className="w-4 h-4 text-blue-400" />
             </div>
             <div className="glass-dark rounded-[2.5rem] p-8 flex items-center justify-between group hover:neon-border transition-all">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-400 border border-blue-400/20 shadow-inner group-hover:scale-110 transition-transform">
                     <Users size={32} />
                   </div>
                   <div>
                      <p className="text-4xl font-black tracking-tighter">42</p>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Authorized Boarded</p>
                   </div>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 cursor-pointer">
                  <ChevronRight size={20} />
                </div>
             </div>
          </div>

          {/* Quick Response Grid */}
          <div className="grid grid-cols-2 gap-4">
            <TacticalButton 
              icon={<Zap className="w-6 h-6" />} 
              label="REPORT DELAY" 
              color="text-yellow-400" 
              bgColor="bg-yellow-400/10" 
              borderColor="border-yellow-400/20"
            />
            <TacticalButton 
              icon={<AlertTriangle className="w-6 h-6" />} 
              label="CRITICAL ERROR" 
              color="text-red-500" 
              bgColor="bg-red-500/10" 
              borderColor="border-red-500/20"
            />
          </div>

          {/* Navigational Vector List */}
          <div className="flex-1 space-y-4 min-h-0">
             <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Waypoints</h3>
               <Navigation className="w-4 h-4 text-white/20" />
             </div>
             <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                <WaypointItem name="Mattuthavani" time="08:50" active />
                <WaypointItem name="Simmakkal" time="09:02" />
                <WaypointItem name="Periyar" time="09:10" />
                <WaypointItem name="College Base" time="09:15" />
             </div>
          </div>

          {/* Primary Action Button */}
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`w-full py-6 rounded-[2.5rem] font-black text-sm tracking-[0.2em] transition-all relative overflow-hidden group shadow-2xl active:scale-95 ${
              isLive 
              ? 'bg-red-600/20 border border-red-500/50 text-red-500' 
              : 'bg-blue-600 text-white shadow-blue-600/20'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {isLive ? 'TERMINATE UPLINK' : 'ESTABLISH NEURAL UPLINK'}
          </button>
        </aside>
      </main>

      {/* Aesthetic Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none scan-line opacity-[0.03] z-[100]" />
    </div>
  );
};

const TacticalButton = ({ icon, label, color, bgColor, borderColor }) => (
  <button className={`flex flex-col items-center justify-center p-6 ${bgColor} border ${borderColor} rounded-[2rem] hover:scale-[1.02] transition-all group relative overflow-hidden`}>
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className={`p-4 rounded-2xl mb-4 transition-transform group-active:scale-90 ${color} bg-white/5`}>
      {icon}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-widest ${color}`}>{label}</span>
  </button>
);

const WaypointItem = ({ name, time, active }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className={`p-5 rounded-3xl flex justify-between items-center transition-all border ${
      active ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white/5 border-transparent opacity-40 hover:opacity-100'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-blue-400 animate-pulse shadow-[0_0_10px_#60a5fa]' : 'bg-white/20'}`} />
      <span className="font-black text-sm tracking-tight">{name}</span>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-[10px] font-black tracking-widest opacity-60">{time} AM</span>
      {active && <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1">Engaged</span>}
    </div>
  </motion.div>
);

export default DriverInterface;

