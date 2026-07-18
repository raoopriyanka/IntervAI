import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser, getInterviewHistory } from '../services/api';

const InterviewHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'Student';

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getInterviewHistory();
      if (data && data.status === "success") {
        setHistory(data.history);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const handleLogout = () => {
    logoutUser(); 
    navigate('/'); 
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  if (loading) return (
    <div className="flex h-screen bg-slate-50 items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* 👈 SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <h1 className="text-2xl font-black text-indigo-600 tracking-tight">IntervAI.</h1>
          </div>
          <nav className="p-4 space-y-2">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition">
              <span>📊</span> Overview
            </Link>
            <Link to="/interview/start" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition">
              <span>🎙️</span> Mock Interviews
            </Link>
            <Link to="/practice" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition">
              <span>💻</span> Practice Bank
            </Link>
            <Link to="/history" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold transition">
              <span>📜</span> Interview History
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
              {getInitials(userName)}
            </div>
            <span className="font-bold text-sm truncate">{userName}</span>
          </div>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-50 rounded-lg transition">
            LOGOUT
          </button>
        </div>
      </aside>

      {/* 📱 MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="p-8 max-w-5xl mx-auto w-full space-y-8 pb-20">
          
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Interview History 📜</h2>
            <p className="text-slate-500">Review all your past mock interviews and track your progress over time.</p>
          </div>

          {history.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center shadow-sm">
              <span className="text-4xl mb-4">📭</span>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No history yet!</h3>
              <p className="text-slate-500 mb-6">Complete your first mock interview to see it listed here.</p>
              <button onClick={() => navigate('/interview/start')} className="px-6 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition">
                Start Interview
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition">{item.role}</h3>
                      <p className="text-sm font-medium text-slate-400 mt-1">🗓️ {item.date}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl font-bold text-sm shrink-0 flex items-center justify-center ${
                      item.score >= 90 ? 'bg-emerald-100 text-emerald-700' : 
                      item.score >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.score}/100
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-auto">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">First Question</span>
                    <p className="text-slate-600 text-sm italic line-clamp-2">"{item.snippet}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default InterviewHistory;