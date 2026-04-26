import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Truck, Cpu, Shield, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.jpeg';
import collegeImg from '../../assets/college_ref.jpeg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password, role);
    if (success) {
      navigate(`/${role}`);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center font-['Outfit',_sans-serif] overflow-hidden bg-slate-950">
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

      <div className="relative z-10 w-full max-w-[460px] px-8 py-12">
        {/* Branding HUD */}
        <div className="text-center mb-10 group">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="relative inline-block"
           >
              <div className="w-28 h-28 bg-white rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.2)] mb-8 mx-auto flex items-center justify-center overflow-hidden border-2 border-white/10 group-hover:rotate-6 transition-transform duration-500">
                 <img 
                   src={logo} 
                   alt="SRM Logo" 
                   className="w-full h-full object-contain scale-[1.7]" 
                 />
              </div>
              <div className="absolute -inset-4 bg-blue-500/10 blur-2xl rounded-full -z-10 group-hover:bg-blue-500/20 transition-all" />
           </motion.div>
           
           <h1 className="text-white text-3xl font-black leading-tight tracking-tighter mb-2 text-glow">
             SRM MCET <br />
             <span className="text-sm font-black text-yellow-400 tracking-[0.3em] uppercase opacity-80">Transit Protocol</span>
           </h1>
        </div>

        {/* Login Node */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-dark rounded-[3rem] p-10 border border-white/10 shadow-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px]" />
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-white text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-6 flex items-center justify-center gap-3">
              <Cpu size={14} className="text-blue-400" /> Authorized Access Node
            </h2>
            
            {/* Role Switcher */}
            <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 shadow-inner">
              <button 
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  role === 'student' ? 'bg-yellow-400 text-[#020617] shadow-xl shadow-yellow-400/20' : 'text-white/30 hover:text-white/60'
                }`}
              >
                <User size={14} /> Student
              </button>
              <button 
                type="button"
                onClick={() => setRole('parent')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  role === 'parent' ? 'bg-yellow-400 text-[#020617] shadow-xl shadow-yellow-400/20' : 'text-white/30 hover:text-white/60'
                }`}
              >
                <Users size={14} /> Parent
              </button>
              <button 
                type="button"
                onClick={() => setRole('driver')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  role === 'driver' ? 'bg-yellow-400 text-[#020617] shadow-xl shadow-yellow-400/20' : 'text-white/30 hover:text-white/60'
                }`}
              >
                <Truck size={14} /> Driver
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Input Vector 01 */}
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-yellow-400 transition-colors z-20">
                <Mail size={18} />
              </div>
              <input
                type="text"
                placeholder="REGISTRATION / EMAIL"
                className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.05] transition-all text-white font-bold text-xs placeholder:text-white/20 tracking-widest"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Input Vector 02 */}
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-yellow-400 transition-colors z-20">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="SECURITY KEY"
                className="w-full pl-16 pr-16 py-5 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.05] transition-all text-white font-bold text-xs placeholder:text-white/20 tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors z-20"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button
                type="submit"
                className="w-full py-5 bg-white text-[#020617] font-black text-xs rounded-2xl shadow-3xl hover:bg-yellow-400 transition-all active:scale-[0.98] uppercase tracking-[0.3em]"
              >
                Login
              </button>

              <Link
                to="/register"
                className="w-full py-4 bg-transparent border-2 border-white/20 text-white font-black text-[10px] rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all active:scale-[0.98] uppercase tracking-[0.3em] flex items-center justify-center"
              >
                Create New Account
              </Link>
            </div>

            <div className="text-center pt-4 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 opacity-20">
                 <Shield size={12} className="text-emerald-400" />
                 <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Encryption Mesh Active</span>
              </div>
              <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.2em]">
                Neural Port 8080 // v4.2.1 Stable
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Screen Aesthetics */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-[200]" />
    </div>
  );
};

export default Login;

