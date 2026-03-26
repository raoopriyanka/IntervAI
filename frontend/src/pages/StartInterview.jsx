import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const StartInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🟢 CAMERA & MIC STATE
  const [micEnabled, setMicEnabled] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);
  const videoRef = useRef(null);

  // 🟢 INTERVIEW CONFIGURATION STATE
  const [interviewType, setInterviewType] = useState('Technical (Coding & Core CS)');
  const [targetRole, setTargetRole] = useState('Software Development Engineer');
  const [techStack, setTechStack] = useState('C++, React, Node.js');

  // 🟢 NEW: TURN ON/OFF THE WEBCAM
  useEffect(() => {
    let currentStream = null;

    const toggleMedia = async () => {
      if (camEnabled) {
        try {
          // Ask browser for camera permission
          currentStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: micEnabled // Will capture audio if mic is also enabled
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = currentStream;
          }
        } catch (err) {
          console.error("Camera access denied:", err);
          alert("Please allow camera permissions in your browser!");
          setCamEnabled(false);
        }
      } else {
        // Turn off camera if the user toggles it off
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    };

    toggleMedia();

    // Cleanup when leaving the page
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [camEnabled, micEnabled]);


  // Pass the configuration data to the active interview screen
  const handleJoinInterview = () => {
    // Make sure we stop the camera before jumping to the next page, 
    // otherwise the next page can't access it!
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

    navigate('/interview/active', {
      state: { interviewType, targetRole, techStack }
    });
  };

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
              
              {/* 🟢 NEW: THE ACTUAL VIDEO TAG */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted // Always mute local preview to avoid echo!
                className={`w-full h-full object-cover scale-x-[-1] ${camEnabled ? 'block' : 'hidden'}`}
              ></video>

              {/* Show placeholder ONLY if camera is OFF */}
              {!camEnabled && (
                <div className="text-slate-500 flex flex-col items-center absolute inset-0 justify-center">
                  <span className="text-5xl mb-4">📷</span>
                  <p>Camera is off</p>
                </div>
              )}
              
              {/* Media Controls Overlay */}
              <div className="absolute bottom-6 flex gap-4 z-10">
                <button 
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-md ${micEnabled ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                >
                  {micEnabled ? '🎙️' : '🔇'}
                </button>
                <button 
                  onClick={() => setCamEnabled(!camEnabled)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-md ${camEnabled ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                >
                  {camEnabled ? '📷' : '🚫'}
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              {camEnabled ? "Looking good! Make sure you are well-lit." : "Please enable camera and microphone to continue."}
            </p>
          </div>

          {/* Right Side: Interview Settings */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Configure Interview</h2>
            
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interview Type</label>
                <select 
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                >
                  <option>Technical (Coding & Core CS)</option>
                  <option>HR & Behavioral</option>
                  <option>System Design</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Role</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tech Stack Focus</label>
                <input 
                  type="text" 
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none" 
                />
              </div>

              <div className="pt-4">
                <button 
                  type="button"
                  onClick={handleJoinInterview}
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