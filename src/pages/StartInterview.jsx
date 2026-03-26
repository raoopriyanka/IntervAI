import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const StartInterview = () => {
  const navigate = useNavigate();
  const [micEnabled, setMicEnabled] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Simple Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8">
        <Link to="/dashboard" className="text-xl font-bold text-indigo-600 tracking-tight">IntervAI.</Link>
        <div className="ml-auto flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> System Check
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-5xl w-full grid lg:grid-cols-5 gap-10 items-center">
          
          {/* Left Side: Video Preview Box */}
          <div className="lg:col-span-3 flex flex-col items-center">
            <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-lg flex items-center justify-center border-4 border-slate-800">
              {camEnabled ? (
                <div className="text-slate-400 flex flex-col items-center">
                  <span className="text-5xl mb-4">🎥</span>
                  <p>Camera feed will appear here</p>
                </div>
              ) : (
                <div className="text-slate-500 flex flex-col items-center">
                  <span className="text-5xl mb-4">📷</span>
                  <p>Camera is off</p>
                </div>
              )}
              
              {/* Media Controls Overlay */}
              <div className="absolute bottom-6 flex gap-4">
                <button 
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-md ${micEnabled ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                >
                  {micEnabled ? '🎙️' : '🔇'}
                </button>
                <button 
                  onClick={() => setCamEnabled(!camEnabled)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-md ${camEnabled ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                >
                  {camEnabled ? '📷' : '🚫'}
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Please allow camera and microphone permissions.</p>
          </div>

          {/* Right Side: Interview Settings */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Configure Interview</h2>
            
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interview Type</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
                  <option>Technical (Coding & Core CS)</option>
                  <option>HR & Behavioral</option>
                  <option>System Design</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Role</label>
                <input type="text" defaultValue="Software Development Engineer" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tech Stack Focus</label>
                <input type="text" defaultValue="C++, React, Node.js" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>

              <div className="pt-4">
                <button 
                  type="button"
                  onClick={() => alert("In Phase 3, this will launch the AI Interviewer!")}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 text-lg flex justify-center items-center gap-2"
                >
                  Join Mock Interview 🚀
                </button>
              </div>
            </form>

          </div>
        </div>
      </main>
    </div>
  );
};

export default StartInterview;