import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scan } from 'lucide-react';

const ScannerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 font-['Inter'] flex flex-col">
       {/* Header */}
       <header className="bg-[#1E3A8A] px-6 py-4 flex items-center gap-4 text-white">
          <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="flex-1 text-center font-black text-xl mr-6">Scan QR Code</h1>
       </header>

       <main className="flex-1 flex flex-col items-center py-12 px-6">
          <p className="text-slate-500 font-bold mb-10">Scan the QR code in the bus</p>

          <div className="relative w-full max-w-sm aspect-square bg-white rounded-[40px] shadow-2xl p-10 flex flex-col items-center justify-center overflow-hidden">
             {/* Corners */}
             <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-[#FBBF24] rounded-tl-2xl" />
             <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-[#FBBF24] rounded-tr-2xl" />
             <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-[#FBBF24] rounded-bl-2xl" />
             <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-[#FBBF24] rounded-br-2xl" />

             {/* QR Placeholder Image or Real Scanner Component */}
             <div className="w-full h-full relative flex items-center justify-center">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SRM-BUS-07" 
                  alt="QR" 
                  className="w-[80%] opacity-80" 
                />
                {/* Scanning Line */}
                <div className="absolute left-0 right-0 h-1 bg-[#1E3A8A] shadow-[0_0_15px_rgba(30,58,138,0.8)] animate-qr-scan top-[45%]" />
             </div>
          </div>

          <div className="mt-12 flex items-center gap-3 text-slate-500 font-bold">
             <Scan className="w-5 h-5" />
             <p className="text-sm">Align QR code within the frame</p>
          </div>
       </main>

       <style dangerouslySetInnerHTML={{ __html: `
          @keyframes qr-scan {
            0% { top: 20%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 75%; opacity: 0; }
          }
          .animate-qr-scan {
            animation: qr-scan 3s ease-in-out infinite;
          }
       `}} />
    </div>
  );
};

export default ScannerPage;
