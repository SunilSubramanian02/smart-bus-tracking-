import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { Bus, Users, MessageSquare, AlertCircle, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

import collegeImg from '../../assets/college_ref.jpeg';

const data = [
  { name: 'Mon', riders: 400, delay: 5 },
  { name: 'Tue', riders: 300, delay: 10 },
  { name: 'Wed', riders: 500, delay: 2 },
  { name: 'Thu', riders: 450, delay: 0 },
  { name: 'Fri', riders: 600, delay: 15 },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen relative font-['Inter'] selection:bg-blue-200">
      {/* Fixed Full Screen Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={collegeImg} 
          className="w-full h-full object-cover opacity-10 grayscale-[0.5]" 
          alt="College Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-white/80 to-slate-100/90 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Admin Command Center</h1>
            <p className="text-slate-500 font-medium">Monitoring 24 active buses for SRM College for Engineering & Technology</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 shadow-sm">Export Report</button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20">System Settings</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Bus className="text-primary"/>} label="Active Buses" value="24" trend="+2 from yesterday" />
          <StatCard icon={<Users className="text-secondary"/>} label="Students Boarded" value="1,420" trend="+12% weekly" />
          <StatCard icon={<MessageSquare className="text-accent"/>} label="Pending Complaints" value="8" trend="-3 from yesterday" />
          <StatCard icon={<AlertCircle className="text-danger"/>} label="SOS Alerts (24h)" value="1" trend="Handled" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
               <TrendingUp className="text-primary w-5 h-5" /> Weekly Ridership Trends
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRiders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="riders" stroke="#1E40AF" strokeWidth={3} fillOpacity={1} fill="url(#colorRiders)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
               <Clock className="text-accent w-5 h-5" /> Delay Analysis (Mins)
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#F1F5F9'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="delay" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Live Status Table */}
        <div className="card overflow-hidden !p-0">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h3 className="text-lg font-bold text-slate-800">Live Bus Fleet Status</h3>
             <div className="flex items-center gap-2">
               <span className="flex items-center gap-1 text-xs font-bold text-secondary">
                 <div className="w-2 h-2 rounded-full bg-secondary" /> 22 Online
               </span>
               <span className="flex items-center gap-1 text-xs font-bold text-slate-400 ml-4">
                 <div className="w-2 h-2 rounded-full bg-slate-300" /> 2 Offline
               </span>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Bus ID</th>
                  <th className="px-6 py-4">Driver</th>
                  <th className="px-6 py-4">Current Stop</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <BusRow id="SRM 07" driver="M. Selvam" stop="Simmakkal" status="On Time" color="text-secondary" />
                <BusRow id="SRM 12" driver="P. Kumar" stop="Mattuthavani" status="Delayed (+12m)" color="text-accent" />
                <BusRow id="SRM 24" driver="S. Ravi" stop="College" status="Parked" color="text-slate-400" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }) => (
  <div className="card hover:border-primary/20 transition-all cursor-default overflow-hidden relative group">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <p className="text-xs font-medium text-slate-500">{trend}</p>
      <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="w-2/3 h-full bg-primary" />
      </div>
    </div>
  </div>
);

const BusRow = ({ id, driver, stop, status, color }) => (
  <tr className="hover:bg-slate-50 transition-colors group">
    <td className="px-6 py-4">
      <div className="font-bold text-slate-800">{id}</div>
      <div className="text-[10px] text-slate-400">Route #402A</div>
    </td>
    <td className="px-6 py-4">
      <div className="text-sm text-slate-600 font-medium">{driver}</div>
    </td>
    <td className="px-6 py-4 text-sm text-slate-600">{stop}</td>
    <td className="px-6 py-4">
      <span className={`text-xs font-bold ${color}`}>{status}</span>
    </td>
    <td className="px-6 py-4">
      <button className="text-xs font-bold text-primary hover:underline">Track</button>
    </td>
  </tr>
);

export default AdminDashboard;
