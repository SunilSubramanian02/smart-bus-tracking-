import React from 'react';
import { QrReader } from 'react-qr-reader';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';

const QRScanner = () => {

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-3xl bg-slate-900 shadow-2xl relative aspect-square">
       <div className="absolute inset-0 z-0 opacity-40">
          {/* Real component would go here */}
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-sm p-10 text-center">
             [ Camera Stream Placeholder ]
          </div>
       </div>

       {/* Scanning Frame Overlay */}
       <div className="absolute inset-0 z-10 flex items-center justify-center p-12">
          <div className="w-full h-full border-4 border-white/30 rounded-3xl relative">
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-xl" />
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-xl" />
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-xl" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-xl" />
             
             {/* Scanning Line Animation */}
             <div className="absolute left-0 right-0 h-1 bg-primary/60 shadow-[0_0_15px_rgba(30,64,175,0.8)] animate-scan-line top-0" />
          </div>
       </div>

       <div className="absolute bottom-6 left-6 right-6 z-20 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
          <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Align QR Code</p>
          <p className="text-white/60 text-[10px]">Scanning for Boarding Confirmation</p>
       </div>

       <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan-line {
            0% { top: 0% }
            100% { top: 100% }
          }
          .animate-scan-line {
            animation: scan-line 2s ease-in-out infinite alternate;
          }
       `}} />
    </div>
  );
};

export default QRScanner;
