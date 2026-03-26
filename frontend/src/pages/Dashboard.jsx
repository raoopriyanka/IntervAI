import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../services/api'; // Make sure this path is correct!

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  // 🟢 SECURITY & DATA FETCHING
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');

    // If they don't have a token, kick them back to login
    if (!token) {
      navigate('/');
    } else {
      setUserName(storedName || 'Student');
    }
  }, [navigate]);

  // 🟢 LOGOUT HANDLER
  const handleLogout = () => {
    logoutUser(); // Clears localStorage
    navigate('/'); // Redirects to login
  };

  // 🟢 HELPER: Get user initials (e.g., "Priyanka Rao" -> "PR", "John" -> "J")
  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // 🟢 MOCK DATA FOR DEMO
  const mockStats = {
    totalInterviews: 12,
    averageScore: 84,
    lastScore: 92,
  };

  const mockSkills = [
    { name: "Communication", score: 88, color: "bg-emerald-500" },
    { name: "Technical Depth", score: 92, color: "bg-indigo-500" },
    { name: "Confidence", score: 78, color: "bg-amber-500" }
  ];

  const mockHistory = [
    { id: 1, role: "Frontend Dev", difficulty: "Hard", score: 92, date: "Today", focus: "React, Virtual DOM" },
    { id: 2, role: "Fullstack Engineer", difficulty: "Medium", score: 85, date: "2 days ago", focus: "Node.js, APIs" },
    { id: 3, role: "Frontend Dev", difficulty: "Medium", score: 76, date: "Last week", focus: "JavaScript Core" }
  ];

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
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition">
              <span>💻</span> Practice Bank
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
              {/* 🟢 DYNAMIC INITIALS */}
              {getInitials(userName)}
            </div>
            {/* 🟢 DYNAMIC USER NAME */}
            <span className="font-bold text-sm truncate">{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-50 rounded-lg transition"
          >
            LOGOUT
          </button>
        </div>
      </aside>

      {/* 📱 MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">

        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          {/* Header items currently commented out in your code */}
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">

          {/* Welcome & Action Banner */}
          <div>
            {/* 🟢 DYNAMIC WELCOME MESSAGE */}
            <h2 className="text-3xl font-bold text-slate-800 mb-1">Welcome back, {userName.split(' ')[0]}! 👋</h2>
            <p className="text-slate-500 mb-6">Ready to level up your interview skills today?</p>

            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center shadow-lg shadow-indigo-200">
              <div className="text-white mb-6 md:mb-0">
                <h3 className="text-2xl font-bold mb-2">Configure Your Next Mock Interview</h3>
                <p className="text-indigo-100">Nova AI will tailor the questions based on your role and difficulty.</p>
              </div>
              {/* Configuration Controls */}
              {/* Configuration Controls */}
              <div className="flex flex-wrap gap-4 items-center mt-6 md:mt-0">
                <button
                  onClick={() => navigate('/interview/start')}
                  className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg flex items-center gap-2"
                >
                  ⚙️ Configure & Start Mock Interview
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <span className="text-sm font-bold text-slate-400 uppercase mb-2">Total Interviews Taken</span>
              <span className="text-4xl font-black text-slate-800">{mockStats.totalInterviews}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <span className="text-sm font-bold text-slate-400 uppercase mb-2">Average Score</span>
              <span className="text-4xl font-black text-indigo-600">{mockStats.averageScore}<span className="text-xl text-slate-400">/100</span></span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <span className="text-sm font-bold text-slate-400 uppercase mb-2">Last Interview Score</span>
              <span className="text-4xl font-black text-emerald-500">{mockStats.lastScore}<span className="text-xl text-slate-400">/100</span></span>
            </div>
          </div>

          {/* Bottom Split: Skills & History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">

            {/* Skill Breakdown */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Skill Breakdown</h3>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">Updated Today</span>
              </div>

              <div className="space-y-6">
                {mockSkills.map((skill, index) => (
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

              {/* AI Insight Badge */}
              <div className="mt-8 bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 items-start">
                <span className="text-xl">💡</span>
                <div>
                  <h4 className="text-sm font-bold text-amber-800 mb-1">Nova's Insight</h4>
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Your technical explanations regarding React and the DOM have improved by 16% this week. Focus on system design principles for your next session.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent History */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Interview History</h3>

              <div className="space-y-4">
                {mockHistory.map((interview) => (
                  <div key={interview.id} className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition cursor-pointer flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition">{interview.role}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {interview.date} • {interview.difficulty} • {interview.focus}
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

              <button className="w-full mt-6 py-3 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition">
                View Detailed Analytics →
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;