import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const SOSPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSOS = () => {
    if (loading) return;
    setLoading(true);
    setMessage(null);

    if (!("geolocation" in navigator)) {
      setMessage({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            `${API_BASE_URL}/alerts/sos`,
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          setActive(true);
          setMessage({ type: 'success', text: 'SOS Alert triggered successfully! Authorities have been notified.' });
        } catch (error) {
          console.error("SOS Trigger Error:", error);
          setMessage({ type: 'error', text: 'Failed to send SOS. Please try again or call emergency services directly.' });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        setMessage({ type: 'error', text: 'Location access denied. Cannot send SOS without location.' });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] flex flex-col">
       {/* Red Header */}
       <header className="bg-[#DC2626] px-6 py-4 flex items-center gap-4 text-white">
          <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="flex-1 text-center font-black text-xl mr-6">Emergency SOS</h1>
       </header>

       <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="relative mb-16 flex items-center justify-center">
             {/* Radiating Rings */}
             <motion.div 
               animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute w-72 h-72 md:w-64 md:h-64 bg-red-100 rounded-full"
             />
             <motion.div 
               animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
               transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
               className="absolute w-72 h-72 md:w-64 md:h-64 bg-red-50 rounded-full"
             />
             
             <button 
               onClick={handleSOS}
               disabled={loading}
               className={`relative z-10 w-60 h-60 md:w-48 md:h-48 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${active ? 'bg-red-800' : 'bg-[#DC2626]'} ${loading ? 'opacity-80' : ''}`}
             >
                <span className="text-white text-5xl md:text-4xl font-black tracking-tighter">
                  {loading ? '...' : 'SOS'}
                </span>
             </button>
          </div>

          <div className="space-y-2 mb-10 h-16">
             <AnimatePresence mode="wait">
               {message ? (
                 <motion.div
                   key="message"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className={`px-6 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold ${message.type === 'success' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-slate-100 text-slate-800 border border-slate-200'}`}
                 >
                   <AlertCircle className="w-5 h-5" />
                   {message.text}
                 </motion.div>
               ) : (
                 <motion.h2 
                   key="prompt"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="text-xl font-black text-slate-800 leading-tight"
                 >
                   Tap the button to send <br /> emergency alert
                 </motion.h2>
               )}
             </AnimatePresence>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex items-start gap-4 max-w-sm w-full">
             <div className="p-3 bg-slate-50 rounded-2xl">
                <MapPin className="text-slate-800 w-6 h-6" />
             </div>
             <div className="text-left">
                <p className="font-bold text-slate-800 leading-tight">Your location will be shared with parents & authorities</p>
             </div>
          </div>
       </main>
    </div>
  );
};

export default SOSPage;
