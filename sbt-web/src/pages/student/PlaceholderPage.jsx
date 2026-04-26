import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] flex flex-col">
      <header className="bg-white px-6 py-5 flex items-center gap-4 text-slate-800 border-b border-slate-200">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center font-black text-xl mr-6 tracking-tight">{title.toUpperCase()}</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
          <Construction size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Under Construction</h2>
        <p className="text-slate-500 max-w-xs">
          The {title} module is currently being built and will be available in the next system update.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
