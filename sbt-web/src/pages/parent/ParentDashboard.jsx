import React, { useState, useEffect, useRef } from 'react';
import { Bus, MapPin, Phone, History, Bell, AlertTriangle, X, LogOut, User as UserIcon, Clock, Volume2, VolumeX, Navigation, ShieldAlert, CheckCircle2, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SOCKET_URL } from '../../config';
import MapMockup from '../../components/Map';
import collegeImg from '../../assets/college_ref.jpeg';
import logo from '../../assets/logo.jpeg';

const ParentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const sirenRef = useRef(null);
  
  const childInfo = {
    name: "Aravind John",
    regNo: "23BME123",
    dept: "Mechanical",
    busNo: "SRM 07",
    status: "ON BOARD",
    eta: "14 mins"
  };

  const driverInfo = {
    name: "Murugan K.",
    phone: "+91 98765 43210",
    experience: "12 Years"
  };

  const emergencyHistory = [
    { id: 1, date: "24 Apr 2026", time: "08:15 AM", status: "RESOLVED" },
    { id: 2, date: "12 Mar 2026", time: "16:45 PM", status: "RESOLVED" }
  ];

  useEffect(() => {
    if (!user || !user._id) return;

    const socket = io(SOCKET_URL);
    
    socket.on('connect', () => {
      socket.emit('join_parent_room', user._id);
    });

    socket.on('student-emergency', (data) => {
      setEmergencyAlert(data);
      if (alertsEnabled && sirenRef.current) {
        // Play the looping siren
        sirenRef.current.play().catch(e => console.warn('Autoplay prevented by browser:', e));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, alertsEnabled]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stopSiren = () => {
    setEmergencyAlert(null);
    if (sirenRef.current) {
      sirenRef.current.pause();
      sirenRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-['Outfit',_sans-serif] selection:bg-yellow-400/30 overflow-x-hidden relative">
      {/* Hidden Looping Siren Audio */}
      <audio 
        ref={sirenRef} 
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" 
        loop 
        preload="auto"
      />
      {/* Cinematic Background HUD */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img 
          src={collegeImg} 
          className="w-full h-full object-cover opacity-90 grayscale-[0.1] scale-105 blur-sm" 
          alt="College Background" 
        />
        
        {/* Dark Clarity Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/40 to-slate-950/80" />
        <div className="absolute inset-0 cyber-grid opacity-[0.05]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
               <img src={logo} alt="Logo" className="w-full h-full object-contain" />
             </div>
             <div>
               <h1 className="text-xs font-black tracking-[0.2em] uppercase text-white/50">SRM Transit</h1>
               <p className="text-sm font-bold text-yellow-400 tracking-wider">PARENT NODE</p>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={() => setAlertsEnabled(!alertsEnabled)}
               className={`p-2 rounded-xl transition-all ${alertsEnabled ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'bg-white/5 text-white/40 border border-white/5'}`}
             >
               {alertsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
             </button>
             <button onClick={handleLogout} className="p-2 bg-white/5 text-white/60 hover:text-red-400 rounded-xl transition-colors border border-white/5 hover:border-red-400/30 hover:bg-red-400/10">
               <LogOut size={18} />
             </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Child Identity Card */}
          <div className="glass-dark border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner p-2 relative">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aravind" alt="Child" className="w-full h-full object-contain" />
               <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-5 h-5 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>

            <div className="flex-1 text-center md:text-left z-10">
               <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                 <h2 className="text-2xl font-black tracking-tight">{childInfo.name}</h2>
                 <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest rounded-full">
                   {childInfo.status}
                 </span>
               </div>
               <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-[11px] font-bold tracking-widest text-white/40 uppercase">
                 <p>ID: <span className="text-white">{childInfo.regNo}</span></p>
                 <p>DEPT: <span className="text-white">{childInfo.dept}</span></p>
                 <p className="text-yellow-400">BUS: {childInfo.busNo}</p>
               </div>
            </div>
            
            <div className="glass p-4 rounded-2xl border border-white/10 flex items-center gap-4 min-w-[200px] z-10">
               <div className="p-3 bg-blue-500/10 rounded-xl">
                 <Clock className="w-6 h-6 text-blue-400" />
               </div>
               <div>
                 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Expected Arrival</p>
                 <p className="text-xl font-black text-white">{childInfo.eta}</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Live Map Section (Col span 2) */}
            <div className="lg:col-span-2 glass-dark border border-white/10 rounded-3xl overflow-hidden flex flex-col relative min-h-[450px]">
               <div className="absolute top-4 left-4 z-10 glass px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 backdrop-blur-md">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Student / Bus Live Tracking</span>
               </div>
               <div className="flex-1 w-full h-full relative z-0">
                  <MapMockup />
               </div>
               
               {/* Location HUD Overlay */}
               <div className="absolute bottom-4 left-4 right-4 glass border border-white/10 p-4 rounded-2xl flex justify-between items-center backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                       <Navigation className="w-5 h-5 text-yellow-400" />
                     </div>
                     <div>
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Current Coordinates</p>
                       <p className="font-mono text-sm font-bold text-white tracking-wider">12.8231° N, 80.0453° E</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Driver & Emergency */}
            <div className="space-y-6 flex flex-col">
               
               {/* Driver Contact Info */}
               <div className="glass-dark border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full pointer-events-none" />
                 <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 relative z-10">
                   <UserIcon size={14} /> Driver Details
                 </h3>
                 <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-white/60" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{driverInfo.name}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Exp: {driverInfo.experience}</p>
                    </div>
                 </div>
                 <a href={`tel:${driverInfo.phone}`} className="relative z-10 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all">
                   <Phone size={14} className="text-yellow-400" /> Call Driver
                 </a>
               </div>

               {/* Emergency History */}
               <div className="glass-dark border border-white/10 rounded-3xl p-6 flex-1 flex flex-col relative overflow-hidden">
                 <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 relative z-10">
                   <ShieldAlert size={14} className="text-red-400" /> Emergency History
                 </h3>
                 
                 <div className="space-y-3 flex-1 relative z-10">
                   {emergencyHistory.map(alert => (
                     <div key={alert.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all">
                        <div>
                          <p className="text-[11px] font-bold tracking-widest">{alert.date}</p>
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">{alert.time}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{alert.status}</span>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>

            </div>
          </div>
        </main>
      </div>

       {/* Emergency Modal Overlay */}
       <AnimatePresence>
         {emergencyAlert && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] flex items-center justify-center p-4"
           >
             <div className="absolute inset-0 bg-red-950/90 backdrop-blur-2xl" />
             
             <motion.div 
               initial={{ scale: 0.8, y: 50 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.8, opacity: 0 }}
               className="glass-dark border border-red-500/30 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-[0_0_100px_rgba(239,68,68,0.2)] flex flex-col items-center text-center"
             >
               <button 
                 onClick={stopSiren}
                 className="absolute top-4 right-4 p-2 text-white/40 hover:text-white bg-white/5 rounded-full"
               >
                 <X className="w-5 h-5" />
               </button>
               
               <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                 <AlertTriangle className="w-12 h-12" />
               </div>
               
               <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Emergency SOS</h2>
               <p className="text-white/70 mb-6 font-medium text-sm">
                 <span className="text-red-400 font-bold">{emergencyAlert.studentName}</span> has triggered an SOS alert from Bus {emergencyAlert.busId || 'SRM-07'}.
               </p>

               <div className="w-full bg-black/40 p-4 rounded-2xl mb-6 border border-white/5 text-left">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Time of Alert</p>
                  <p className="font-bold text-white tracking-widest mb-4">{new Date(emergencyAlert.time).toLocaleTimeString()}</p>
                  
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Live Coordinates</p>
                  <p className="font-mono text-sm text-yellow-400 font-bold">{emergencyAlert.location?.lat.toFixed(6)}, {emergencyAlert.location?.lng.toFixed(6)}</p>
               </div>
               
               <div className="flex flex-col gap-3 w-full">
                 <div className="flex gap-3 w-full">
                   <a 
                     href={`https://www.google.com/maps?q=${emergencyAlert.location?.lat},${emergencyAlert.location?.lng}`}
                     target="_blank" rel="noopener noreferrer"
                     className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-red-600/20 hover:bg-red-500 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
                   >
                     <MapPin className="w-4 h-4" /> TRACK LIVE LOCATION
                   </a>
                   <a href="tel:100" className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-black text-xs shadow-lg hover:bg-white/20 border border-white/10 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest">
                     <Phone className="w-4 h-4" /> Dial 100
                   </a>
                 </div>
                 <button 
                   onClick={stopSiren}
                   className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs shadow-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
                 >
                   Acknowledge & Stop Siren
                 </button>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

    </div>
  );
};

export default ParentDashboard;
