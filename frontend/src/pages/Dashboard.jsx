import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser, getDashboardStats } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  // 🟢 NEW: State to hold our real backend data
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // 🟢 SECURITY & DATA FETCHING
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      const storedName = localStorage.getItem('userName');

      if (!token) {
        navigate('/');
        return;
      }
      setUserName(storedName || 'Student');

      // 🟢 Fetch real data from FastAPI
      const data = await getDashboardStats();
      if (data && data.status === "success") {
        setDashboardData(data);
      } else {
        // They haven't taken an interview yet (status: "empty")
        setDashboardData(null);
      }
      setLoading(false);
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

      {/* 👈 SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <h1 className="text-2xl font-black text-indigo-600 tracking-tight">IntervAI.</h1>
          </div>
          <nav className="p-4 space-y-2">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold transition">
              <span>📊</span> Overview
            </Link>
            <Link to="/interview/start" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition">
              <span>🎙️</span> Mock Interviews
            </Link>
            <Link to="/practice" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition">
              <span>💻</span> Practice Bank
            </Link>
            <Link to="/history" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition">
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
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">

          {/* Welcome Banner */}
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-1">Welcome back, {userName.split(' ')[0]}! 👋</h2>
            <p className="text-slate-500 mb-6">Ready to level up your interview skills today?</p>

            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center shadow-lg shadow-indigo-200">
              <div className="text-white mb-6 md:mb-0">
                <h3 className="text-2xl font-bold mb-2">Start Your Next Session</h3>
                <p className="text-indigo-100">Nova AI will tailor the questions based on your target role.</p>
              </div>
              <button
                onClick={() => navigate('/interview/start')}
                className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg flex items-center gap-2"
              >
                ⚙️ Configure Mock Interview
              </button>
            </div>
          </div>

          {/* 🟢 DYNAMIC CONTENT RENDER */}
          {dashboardData ? (
            <>
              {/* Real Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <span className="text-sm font-bold text-slate-400 uppercase mb-2">Questions Answered</span>
                  <span className="text-4xl font-black text-slate-800">{dashboardData.stats.totalInterviews}</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <span className="text-sm font-bold text-slate-400 uppercase mb-2">Average Score</span>
                  <span className="text-4xl font-black text-indigo-600">{dashboardData.stats.averageScore}<span className="text-xl text-slate-400">/100</span></span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <span className="text-sm font-bold text-slate-400 uppercase mb-2">Last Question Score</span>
                  <span className="text-4xl font-black text-emerald-500">{dashboardData.stats.lastScore}<span className="text-xl text-slate-400">/100</span></span>
                </div>
              </div>

              {/* Bottom Split: Skills & History */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">

                {/* Real Skill Breakdown */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Skill Breakdown</h3>
                  </div>
                  <div className="space-y-6">
                    {dashboardData.skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                          <span>{skill.name}</span>
                          <span>{skill.score}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div className={`${skill.color} h-2.5 rounded-full`} style={{ width: `${skill.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real Recent History */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Recent History</h3>
                  <div className="space-y-4">
                    {dashboardData.history.map((interview) => (
                      <div key={interview.id} className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition cursor-pointer flex justify-between items-center group">
                        <div>
                          <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition">{interview.role}</h4>
                          <p className="text-xs text-slate-500 font-medium mt-1">
                            {interview.date} • {interview.difficulty} • {interview.score >= 80 ? "Passed" : "Needs Review"}
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-bold text-sm ${interview.score >= 90 ? 'bg-emerald-100 text-emerald-700' :
                            interview.score >= 80 ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                          {interview.score}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // 🟢 EMPTY STATE: If they have never taken an interview
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-4">
                📈
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No data yet!</h3>
              <p className="text-slate-500 mb-6 max-w-md">Take your first mock interview to generate your baseline skills breakdown and AI analytics.</p>
              <button
                onClick={() => navigate('/interview/start')}
                className="px-6 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition"
              >
                Start First Interview
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;