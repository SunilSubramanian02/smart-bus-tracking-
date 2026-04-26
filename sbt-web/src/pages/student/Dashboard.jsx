import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, ScanQrCode, AlertTriangle, 
  User, ShieldCheck,
  Zap, Radio, Clock,
  LayoutDashboard, Search, MapIcon, Navigation,
  Activity, Cpu, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.jpeg';
import collegeImg from '../../assets/college_ref.jpeg';

const SpatialChip = ({ label, value, icon }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 glass-dark rounded-full border border-white/10 group hover:border-blue-500/50 transition-all cursor-default">
    {React.cloneElement(icon, { size: 12, className: "text-blue-400 group-hover:animate-pulse" })}
    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{label}</span>
    <span className="text-[9px] font-black text-white">{value}</span>
  </div>
);

const InteractiveCard = ({ icon, title, desc, accent, light, onClick }) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    whileHover={{ y: -8, scale: 1.02 }}
    onClick={onClick}
    className="glass-dark rounded-[2.8rem] p-8 flex flex-col items-start gap-8 group relative overflow-hidden text-left transition-all duration-500 hover:neon-border border border-white/5"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className={`w-16 h-16 ${accent} rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 relative`}>
       <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
       {React.cloneElement(icon, { size: 32, strokeWidth: 2.5, className: light ? 'text-[#0b48a0]' : 'text-white relative z-10' })}
    </div>
    <div className="space-y-1.5 relative z-10">
       <h3 className="text-sm font-black text-white tracking-widest uppercase">{title}</h3>
       <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{desc}</p>
    </div>
    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-20 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
       <Cpu size={40} className="text-white" />
    </div>
  </motion.button>
);

const DockItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group outline-none relative">
    <AnimatePresence>
      {active && (
        <motion.div 
          layoutId="dock-active"
          className="absolute -top-3 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]"
        />
      )}
    </AnimatePresence>
    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 ${
      active ? 'bg-yellow-400 text-[#0b48a0] shadow-[0_0_30px_rgba(255,193,7,0.4)]' : 'text-white/20 hover:text-white/50'
    }`}>
       {React.cloneElement(icon, { size: 24, strokeWidth: active ? 3 : 2 })}
    </div>
    <p className={`text-[8px] font-black uppercase tracking-[0.3em] transition-all ${active ? 'opacity-100 text-yellow-400 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
       {label}
    </p>
  </button>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [busDist] = useState(0.8);

  const notifications = [
    { id: 1, title: 'Bus SRM-07', message: 'Bus is nearing your stop (Pudur Point)', time: '2m ago' },
    { id: 2, title: 'System Update', message: 'Neural Link v4.2 Stable is now active.', time: '1h ago' }
  ];

  return (
    <div className="min-h-screen relative font-['Outfit',_sans-serif] selection:bg-yellow-400/30 overflow-x-hidden bg-slate-950">
      {/* Cinematic Background HUD */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img 
          src={collegeImg} 
          className="w-full h-full object-cover opacity-90 grayscale-[0.1] scale-105" 
          alt="College Background" 
        />
        
        {/* Dark Clarity Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/40 to-slate-950/80" />
        <div className="absolute inset-0 cyber-grid opacity-[0.05]" />
      </div>

      <div className="relative z-10 pb-40">
        {/* Futuristic Navbar */}
        <div className="p-8 flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-14 h-14 glass-dark rounded-[1.2rem] flex items-center justify-center border border-white/10 overflow-hidden group shadow-2xl relative z-10">
                   <img src={logo} alt="L" className="w-full h-full object-contain scale-[1.6] group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <div className="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full -z-0 animate-pulse" />
              </div>
              <div>
                 <p className="text-yellow-400 text-[9px] font-black tracking-[0.4em] uppercase opacity-80 text-glow-yellow">SRM MCET</p>
                 <h1 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
                    CENTRAL NODE <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping shadow-[0_0_10px_#60a5fa]" />
                 </h1>
              </div>
           </div>
           
           <div className="flex items-center gap-4 relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-14 h-14 glass-dark rounded-2xl flex items-center justify-center relative hover:bg-white/10 transition-all active:scale-90 group border border-white/5"
              >
                 <Bell className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
                 <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-[0_0_15px_#facc15]" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: -20 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-20 right-0 w-80 glass-dark border border-white/15 rounded-[2.5rem] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.6)] z-[100] backdrop-blur-3xl"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white text-[10px] font-black uppercase tracking-widest opacity-50">Signal Intelligence</h3>
                      <Activity size={14} className="text-blue-400" />
                    </div>
                    <div className="space-y-4">
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 bg-white/[0.03] rounded-3xl border border-white/5 hover:bg-white/[0.06] transition-colors cursor-default group">
                          <p className="text-yellow-400 text-[9px] font-black uppercase tracking-tighter mb-1.5">{n.title}</p>
                          <p className="text-white/80 text-xs font-medium leading-relaxed">{n.message}</p>
                          <p className="text-white/20 text-[9px] mt-3 font-bold flex items-center gap-2">
                            <Clock size={10} /> {n.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Hero HUD Section */}
        <div className="px-8 pt-4 pb-12 space-y-6">
           <div className="flex flex-wrap gap-3">
              <SpatialChip label="Uplink" value="Secure" icon={<Globe />} />
              <SpatialChip label="Core" value="v4.2.1" icon={<Cpu />} />
              <SpatialChip label="Latency" value="12ms" icon={<Activity />} />
           </div>
           
           <div className="space-y-1">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl"
             >
                <Zap className="w-3 h-3 text-blue-400 animate-pulse" />
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">Neural Protocol Engaged</span>
             </motion.div>
             <h2 className="text-white text-6xl font-black tracking-tighter leading-[0.9] pt-4">
               TRANSIT <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-glow">INTERFACE</span>
             </h2>
           </div>
        </div>

        {/* Tactical UI Grid */}
        <div className="px-8 space-y-8">
           
           {/* Radar View: Tactical Bus Tracking */}
           <motion.div 
             whileHover={{ scale: 1.02 }}
             className="glass p-10 rounded-[3.5rem] border border-slate-200 relative overflow-hidden group shadow-3xl"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] group-hover:bg-blue-600/20 transition-all duration-700" />
              
              <div className="flex items-center justify-between relative z-10 mb-10">
                 <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-blue-600 rounded-[1.8rem] flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform duration-500">
                         <Radio className="w-8 h-8 animate-pulse" />
                      </div>
                      <div className="absolute -inset-2 border border-blue-500/30 rounded-[2rem] animate-pulse-soft" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1.5 flex items-center gap-2">
                         <Globe size={12} /> Live Coordinate Link
                       </p>
                       <h3 className="text-2xl font-black text-slate-800 tracking-tight">SRM FLEET - 07</h3>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-4xl font-black text-blue-600 tracking-tighter">{busDist} <span className="text-sm">KM</span></p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Spatial Proximity</p>
                 </div>
              </div>

              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-8 border border-slate-200">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '82%' }}
                   transition={{ duration: 2.5, ease: "easeOut" }}
                   className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent rounded-full shadow-[0_0_20px_#2563eb]"
                 />
                 <div className="absolute inset-0 cyber-grid opacity-20" />
              </div>

              <div className="flex items-center justify-between text-slate-400 font-black text-[11px] uppercase tracking-[0.3em]">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                    <span>Pudur Point</span>
                 </div>
                 <div className="flex items-center gap-2 text-blue-600">
                    <span>Central Base</span>
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                 </div>
              </div>
           </motion.div>

           {/* Action Matrix */}
           <div className="grid grid-cols-2 gap-6">
              <InteractiveCard 
                icon={<Navigation />} 
                title="RADAR MAP" 
                desc="Spatial Grid" 
                accent="bg-blue-600" 
                onClick={() => navigate('/student/track')} 
              />
              <InteractiveCard 
                icon={<ScanQrCode />} 
                title="BIO BOARD" 
                desc="Quantum Auth" 
                accent="bg-blue-500" 
                onClick={() => navigate('/student/scan')} 
              />
              <InteractiveCard 
                icon={<ShieldCheck />} 
                title="IDENTITY" 
                desc="Secure Node" 
                accent="bg-emerald-500" 
                onClick={() => navigate('/student/profile')} 
              />
              <InteractiveCard 
                icon={<AlertTriangle />} 
                title="SOS UPLINK" 
                desc="Emergency" 
                accent="bg-red-600" 
                onClick={() => navigate('/student/sos')} 
              />
           </div>

           {/* Security Mesh Card */}
           <div className="glass p-10 rounded-[3.5rem] border border-slate-200 relative overflow-hidden group shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col gap-8 relative z-10">
                 <div className="flex items-center justify-between">
                    <div className="p-4 bg-emerald-500/10 rounded-[1.8rem] border border-emerald-500/20">
                       <ShieldCheck className="text-emerald-500 w-8 h-8" />
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                       <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]" />
                         Mesh Verified
                       </p>
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <h4 className="text-slate-800 text-4xl font-black leading-[1.1] tracking-tight">ENCRYPTED <br /> PERIMETER.</h4>
                    <p className="text-slate-500 text-sm font-bold leading-relaxed max-w-xs">
                       Advanced biometric tracking is active. Your session is protected by Neural Link security protocols.
                    </p>
                 </div>

                 <button className="w-full py-5 bg-[#0b48a0] text-white font-black text-sm rounded-3xl shadow-2xl hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest">
                    SYNC NEURAL NODE
                 </button>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000 rotate-12">
                 <Cpu size={180} className="text-slate-900" />
              </div>
           </div>
        </div>
      </div>

      {/* Command Dock HUD */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[94%] max-w-lg z-[100]">
         <div className="glass px-10 py-6 rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.15)] border border-slate-200 flex items-center justify-between backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5 pointer-events-none" />
            <DockItem icon={<LayoutDashboard />} label="Cmd" active />
            <DockItem icon={<MapIcon />} label="Radar" onClick={() => navigate('/student/track')} />
            <DockItem icon={<Search />} label="Auth" onClick={() => navigate('/student/scan')} />
            <DockItem icon={<User />} label="Bio" onClick={() => navigate('/student/profile')} />
         </div>
      </div>

      {/* Aesthetic Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-[200]" />
    </div>
  );
};

export default Dashboard;


