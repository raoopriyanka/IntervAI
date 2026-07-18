import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../services/api';

// 🟢 NEW: Import your massive question bank
import { questionBank } from '../data/questionBank'; 

const PracticeBank = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const userName = localStorage.getItem('userName') || 'Student';

  const handleLogout = () => {
    logoutUser(); 
    navigate('/'); 
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // 🟢 UPDATED: Point the filter logic to the new imported database
  const filteredQuestions = questionBank.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || q.category === filter;
    return matchesSearch && matchesFilter;
  });

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
            <Link to="/practice" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold transition">
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
          
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Practice Bank 📚</h2>
            <p className="text-slate-500">Master specific questions curated from top tech companies.</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none shadow-sm"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {['All', 'Data Structures', 'Algorithms', 'System Design', 'Frontend', 'Behavioral'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition ${
                    filter === cat 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map(q => (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                    q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {q.difficulty}
                  </span>
                  <span className="text-xs font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded-md">
                    {q.company}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-snug">{q.title}</h3>
                <div className="text-sm font-medium text-slate-500 mb-6 flex gap-3">
                  <span>📂 {q.category}</span>
                  <span>⏱️ {q.time}</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <button 
                    // 🟢 UPDATED: Pass the specific question data to the Lobby!
                    onClick={() => navigate('/interview/start', {
                      state: {
                        interviewType: q.category,
                        targetRole: "Candidate",
                        techStack: q.title // We pass the question title here so Gemini asks it!
                      }
                    })}
                    className="w-full py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition flex items-center justify-center gap-2"
                  >
                    Practice Now →
                  </button>
                </div>
              </div>
            ))}
            
            {filteredQuestions.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No questions found matching your criteria.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default PracticeBank;