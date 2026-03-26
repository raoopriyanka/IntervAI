import { Link } from 'react-router-dom';
const Dashboard = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar (Hidden on small screens for now) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-8 border-b border-slate-100">
            <span className="text-xl font-bold text-indigo-600 tracking-tight">IntervAI.</span>
          </div>
          <nav className="p-4 space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
              <span>📊</span> Overview
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition">
              <span>🎙️</span> Mock Interviews
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition">
              <span>💻</span> DSA Practice
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition">
              <span>📈</span> Analytics
            </a>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
              S
            </div>
            <div className="text-sm font-medium">Student Profile</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
          <Link to="/interview/start" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-200">
  + New Interview
</Link>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-6xl mx-auto space-y-8">
          
          {/* Welcome Message */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome back! 👋</h2>
            <p className="text-slate-500 mt-1">Here is your placement readiness overview for this week.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-500 text-sm font-medium mb-2">Placement Readiness</div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-extrabold text-indigo-600">78%</span>
                <span className="text-emerald-500 text-sm font-medium mb-1">↑ 4% this week</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-500 text-sm font-medium mb-2">Interviews Completed</div>
              <div className="text-4xl font-extrabold text-slate-800">12</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-500 text-sm font-medium mb-2">DSA Problems Solved</div>
              <div className="text-4xl font-extrabold text-slate-800">45</div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">Recent Mock Interviews</h3>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</a>
            </div>
            <div className="divide-y divide-slate-100">
              
              {/* Mock Data Row 1 */}
              <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-xl">💻</div>
                  <div>
                    <div className="font-semibold text-slate-800">Technical Round - C++ & OOPs Core</div>
                    <div className="text-xs text-slate-500 mt-0.5">Today at 10:30 AM • 45 mins</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Analyzed</span>
                  <button className="text-sm font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100">View Report</button>
                </div>
              </div>

              {/* Mock Data Row 2 */}
              <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">🤝</div>
                  <div>
                    <div className="font-semibold text-slate-800">HR Behavioral - Amazon Focus</div>
                    <div className="text-xs text-slate-500 mt-0.5">Yesterday • 20 mins</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Analyzed</span>
                  <button className="text-sm font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100">View Report</button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;