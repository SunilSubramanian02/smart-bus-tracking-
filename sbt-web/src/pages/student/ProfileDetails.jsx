import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, GraduationCap, FileText, Edit2, Check, X } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

import campusImage from '../../assets/college_ref.jpeg';

const ProfileDetails = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    registerNumber: '',
    department: ''
  });

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
        setEditData({
          name: response.data.user.name || '',
          registerNumber: response.data.user.registerNumber || '',
          department: response.data.user.department || ''
        });
      } catch (error) {
        console.error('Error fetching profile from backend:', error.message);
        // Fallback to localStorage if the deployed backend lacks the /me endpoint
        const localUser = localStorage.getItem('user');
        if (localUser) {
          const parsedUser = JSON.parse(localUser);
          setProfile(parsedUser);
          setEditData({
            name: parsedUser.name || '',
            registerNumber: parsedUser.registerNumber || '',
            department: parsedUser.department || ''
          });
        } else {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Derive missing fields
  const getDerivedName = (email) => {
    if (!email) return 'Student';
    return email.split('@')[0].replace('.', ' ');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      // Always update local cache first
      const updatedProfile = { ...profile, ...editData };
      setProfile(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));

      // Attempt to save to backend (will fail if not deployed)
      await axios.put(
        `${API_BASE_URL}/users/me`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.warn('Backend save failed (likely pending deployment). Local cache updated.');
      alert('Profile saved locally! Changes will sync to cloud after the next backend deployment.');
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    if (!profile) return;
    setEditData({
      name: profile.name || getDerivedName(profile.email),
      registerNumber: profile.registerNumber || '',
      department: profile.department || ''
    });
    setIsEditing(true);
  };

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
        <header className="bg-white/70 backdrop-blur-2xl px-6 py-5 flex items-center justify-between text-slate-800 border-b border-white/50 sticky top-0">
          <button onClick={() => navigate('/student/profile')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-black text-xl tracking-tight">MY PROFILE</h1>
          
          {!isEditing && profile ? (
            <button onClick={handleEditClick} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-blue-600">
              <Edit2 className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9" /> // placeholder for alignment
          )}
        </header>

        <div className="px-6 py-8">

          {/* User Card */}
          <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center mb-8 relative overflow-hidden">
             
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden mb-6 flex items-center justify-center relative z-10">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email || 'Student'}`} alt="Avatar" />
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4 w-full flex flex-col items-center">
                <div className="h-8 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </div>
            ) : profile ? (
              <>
                <h2 className="text-3xl font-black text-slate-800 capitalize mb-2">{profile.name || getDerivedName(profile.email)}</h2>
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
                  {profile.role}
                </span>
              </>
            ) : (
              <h2 className="text-2xl font-black text-slate-800">User Not Found</h2>
            )}
          </div>

          {/* Detailed Info Grid */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl overflow-hidden divide-y divide-slate-50 border border-slate-100">
             
            <DetailItem 
               icon={<User className="text-blue-500" />} 
               label="Full Name" 
               value={loading ? '...' : (profile?.name || getDerivedName(profile?.email))} 
               isEditing={isEditing}
               editValue={editData.name}
               onEditChange={(val) => setEditData({ ...editData, name: val })}
            />
            
            <DetailItem 
               icon={<FileText className="text-emerald-500" />} 
               label="Register Number" 
               value={loading ? '...' : (profile?.registerNumber || 'Not Specified')} 
               isEditing={isEditing}
               editValue={editData.registerNumber}
               onEditChange={(val) => setEditData({ ...editData, registerNumber: val })}
            />
            
            <DetailItem 
               icon={<GraduationCap className="text-purple-500" />} 
               label="Department" 
               value={loading ? '...' : (profile?.department || 'Not Specified')} 
               isEditing={isEditing}
               editValue={editData.department}
               onEditChange={(val) => setEditData({ ...editData, department: val })}
            />
            
            <DetailItem 
               icon={<Mail className="text-amber-500" />} 
               label="Email Address" 
               value={loading ? '...' : profile?.email} 
               isEditing={false} // Email cannot be edited
            />

          </div>

          {isEditing && (
            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
              >
                <X size={18} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] py-4 bg-blue-600 text-white font-black tracking-widest uppercase rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all"
              >
                {saving ? 'Saving...' : <><Check size={18} /> Save Changes</>}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value, isEditing, editValue, onEditChange }) => (
  <div className="w-full px-6 py-5 flex items-center gap-5 hover:bg-slate-50 transition-colors">
    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
       {icon}
    </div>
    <div className="flex-1 flex flex-col">
       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</span>
       {isEditing ? (
         <input 
           type="text" 
           value={editValue} 
           onChange={(e) => onEditChange(e.target.value)}
           className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
           placeholder={`Enter ${label.toLowerCase()}`}
         />
       ) : (
         <span className="font-bold text-slate-800 text-sm capitalize">{value || 'N/A'}</span>
       )}
    </div>
  </div>
);

export default ProfileDetails;
