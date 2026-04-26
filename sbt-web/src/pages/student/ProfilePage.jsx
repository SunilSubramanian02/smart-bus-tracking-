import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Lock, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

// 👉 Import your image (place image in src/assets folder)
import campusImage from '../../assets/college_ref.jpeg';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProfile(response.data.user);
      } catch (error) {
        console.error('Error fetching profile from backend:', error.message);
        // Fallback to localStorage
        const localUser = localStorage.getItem('user');
        if (localUser) {
          setProfile(JSON.parse(localUser));
        } else {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen relative font-['Inter'] selection:bg-yellow-200 overflow-hidden">
      {/* Fixed Full Screen Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={campusImage} 
          className="w-full h-full object-cover opacity-20 grayscale-[0.3]" 
          alt="College Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-white/40 to-slate-100/95 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-2xl px-6 py-5 flex items-center gap-4 text-slate-800 border-b border-white/50 sticky top-0">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-black text-xl mr-6 tracking-tight">PROFILE NODE</h1>
        </header>

        <div className="px-6 py-8">

          {/* User Card */}
          <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center mb-8">

            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden mb-4 flex items-center justify-center">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email || 'Student'}`} alt="Avatar" />
            </div>

            {loading ? (
              <div className="animate-pulse space-y-3 w-full flex flex-col items-center">
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </div>
            ) : profile ? (
              <>
                <h2 className="text-2xl font-black text-slate-800 capitalize">{profile.email.split('@')[0].replace('.', ' ')}</h2>
                <p className="text-slate-500 font-bold text-sm">
                  Email: <span className="text-slate-700">{profile.email}</span>
                </p>
                <p className="text-slate-500 font-bold text-sm">
                  Role: <span className="text-slate-700 uppercase">{profile.role}</span>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black text-slate-800">Student Name</h2>
                <p className="text-slate-500 font-bold text-sm">
                  User data not found. Please log in again.
                </p>
              </>
            )}
          </div>

          {/* Menu List */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl overflow-hidden divide-y divide-slate-50">
            <MenuItem icon={<User className="text-blue-600" />} label="My Profile" to="/student/profile/details" />
            <MenuItem icon={<Lock className="text-blue-900" />} label="Change Password" to="/student/profile/password" />
            <MenuItem icon={<HelpCircle className="text-blue-500" />} label="Help & Support" to="/student/profile/support" />
            <MenuItem
              icon={<LogOut className="text-red-500" />}
              label="Logout"
              onClick={() => { logout(); navigate('/login'); }}
              noChevron
            />
          </div>

        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, onClick, noChevron, to }) => {
  const content = (
    <>
      <div className="flex items-center gap-4">
        <span className="p-2 bg-slate-50 rounded-xl">{icon}</span>
        <span className="font-bold text-slate-700">{label}</span>
      </div>
      {!noChevron && <ChevronRight className="w-5 h-5 text-slate-300" />}
    </>
  );

  const className = "w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-all text-left";

  if (to) {
    return <Link to={to} className={className}>{content}</Link>;
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
};

export default ProfilePage;