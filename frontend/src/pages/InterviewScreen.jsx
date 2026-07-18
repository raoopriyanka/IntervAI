import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { startInterviewSession, submitInterviewAnswer } from '../services/api';
import 'regenerator-runtime/runtime'; // Required for speech recognition
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import { useEyeTracking } from '../hooks/useEyeTracking';

const InterviewScreen = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // 🟢 Extract the configuration passed from the StartInterview screen
  const { interviewType, targetRole, techStack } = location.state || {
    interviewType: "Technical (Coding & Core CS)",
    targetRole: "Software Development Engineer",
    techStack: "React"
  };

  // 🟢 STATE MANAGEMENT
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);

  // 🟢 NEW: IDE State Management
  const [code, setCode] = useState('// Write your code here...\n');
  const [language, setLanguage] = useState('cpp'); // Default to C++
  
  // 🟢 NEW: Helper to check if we should show the IDE
  const isCodingInterview = interviewType === 'Data Structures' || interviewType === 'Algorithms';

  // 🟢 Timer State (120 seconds = 2 minutes)
  const [timeLeft, setTimeLeft] = useState(120);

  // 🟢 CAMERA STATE
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  // 🟢 NEW: INITIALIZE EYE TRACKING
  const { isDistracted, distractionCount } = useEyeTracking(videoRef, cameraActive);

  // 🟢 REACT-SPEECH-RECOGNITION HOOK
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Sync the live transcript into your text area
  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  // 🟢 INITIALIZE SESSION ON MOUNT
  useEffect(() => {
    const initInterview = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); 
        return;
      }

      const configPayload = { interviewType, targetRole, techStack };
      const response = await startInterviewSession(configPayload);
      
      if (response && response.question) {
        setCurrentQuestion(response.question);
      } else {
        // If it fails, tell the user exactly what happened!
        setCurrentQuestion(`Error: Could not connect to Nova AI. Please check your FastAPI terminal for errors.`);
      }
      
      setLoading(false);
      setIsStarted(true);
    };

    initInterview();
  }, [navigate, interviewType, targetRole, techStack]);

  // 🟢 START CAMERA (ONLY AFTER LOADING SCREEN IS GONE)
  useEffect(() => {
    let stream = null;
    
    const startCamera = async () => {
      if (!loading && !cameraActive && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        } catch (err) {
          console.error("Camera/Mic permission denied:", err);
        }
      }
    };

    startCamera();

    // CLEANUP CAMERA ON UNMOUNT
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [loading, cameraActive]);

  // 🟢 TEXT TO SPEECH (AI VOICE)
  useEffect(() => {
    if (isStarted && currentQuestion) {
      window.speechSynthesis.cancel(); 
      
      // Strip out markdown characters (backticks, asterisks) just for the voice!
      const textToSpeak = currentQuestion.replace(/[`*#_]/g, '');
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Female')) || voices[0];
      utterance.rate = 0.95; 
      utterance.pitch = 1.1;
      
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 500);
    }
    
    return () => window.speechSynthesis.cancel();
  }, [currentQuestion, isStarted]);

  // 🟢 Timer Countdown Logic
  useEffect(() => {
    // Only run the timer if the interview is active and not submitting
    if (!isStarted || isSubmitting || interviewComplete) return;

    // Stop timer at 0
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isStarted, isSubmitting, interviewComplete]);

  // 🟢 Reset Timer when a new question loads
  useEffect(() => {
    setTimeLeft(120); // Reset to 2 minutes
  }, [currentQuestion]);

  // 🟢 Helper to format seconds into M:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 🟢 CLEAN TOGGLE HANDLER
  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  // 🟢 SUBMIT ANSWER HANDLER
  const handleSubmitAnswer = async () => {
    // Prevent submitting if both answer and code are completely empty
    if (!answer.trim() && (!isCodingInterview || !code.trim())) return;
    
    setIsSubmitting(true);
    if (listening) SpeechRecognition.stopListening(); 

    window.speechSynthesis.cancel();

    // 🟢 NEW: Combine Code and Speech into one smart payload for Gemini
    let finalAnswer = answer;
    if (isCodingInterview) {
      finalAnswer = `[WRITTEN CODE - ${language.toUpperCase()}]\n${code}\n\n[VERBAL EXPLANATION]\n${answer}`;
    }

    const payload = { question: currentQuestion, answer: finalAnswer };
    const response = await submitInterviewAnswer(payload);

    resetTranscript(); // Clear the audio buffer for the next question
    if (isCodingInterview) setCode('// Write your code here...\n'); // Reset IDE

    if (questionCount >= 5) {
      setInterviewComplete(true);
    } else {
      if (response && response.next_question) {
        setCurrentQuestion(response.next_question);
      } else {
        // Error handling
        setCurrentQuestion(`Error: AI failed to generate the next question. Please check backend logs.`);
      }
      setAnswer('');
      setQuestionCount(prev => prev + 1);
    }
    
    setIsSubmitting(false);
  };

  const handleEndInterview = () => {
    if(window.confirm("Are you sure you want to end this interview early?")) {
      window.speechSynthesis.cancel(); 
      navigate('/dashboard');
    }
  };

  if (loading) return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-slate-700">Connecting to Nova AI...</h2>
      </div>
  );

  if (interviewComplete) return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white max-w-lg w-full rounded-2xl p-10 text-center shadow-xl shadow-indigo-100/50 border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🎉</div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Interview Complete!</h2>
          <button 
            onClick={() => navigate('/interview/results')} 
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition"
          >
            View Detailed Feedback →
          </button>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      
      {/* TOP NAVIGATION BAR */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-12 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-bold text-slate-700 tracking-tight">Interview in Progress</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          
          {/* Timer Badge */}
          <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border font-bold ${
            timeLeft <= 30 
              ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' 
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span>⏱️</span>
            <span className="text-lg w-12 text-center">{formatTime(timeLeft)}</span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
            <span className="text-sm font-bold text-indigo-400">QUESTION</span>
            <span className="text-lg font-black text-indigo-700">{questionCount}<span className="text-indigo-300">/5</span></span>
          </div>
          <button onClick={handleEndInterview} className="text-sm font-bold text-slate-400 hover:text-red-500 transition">End Early</button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-8 gap-8 overflow-hidden">
        
        {/* LEFT PANEL */}
        <div className="w-full md:w-5/12 flex flex-col gap-6">
          
          {/* AI Avatar */}
          <div className="bg-gradient-to-br from-indigo-900 to-violet-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden shrink-0 h-48">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center mb-3 mx-auto shadow-2xl">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Nova AI</h3>
            </div>
            {!isSubmitting && (
              <div className="absolute bottom-4 flex gap-1 items-center justify-center">
                <div className="w-1.5 h-3 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                <div className="w-1.5 h-5 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_100ms]"></div>
                <div className="w-1.5 h-4 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
              </div>
            )}
          </div>

          {/* USER CAMERA FEED */}
          <div className={`bg-black rounded-3xl overflow-hidden shadow-lg relative h-48 border-4 shrink-0 transition-colors duration-300 ${
            isDistracted ? 'border-red-500 shadow-red-500/50' : 'border-slate-800'
          }`}>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover scale-x-[-1]" 
            ></video>
            
            {/* 🟢 NEW: DISTRACTION WARNING */}
            {isDistracted && (
              <div className="absolute inset-0 bg-red-500/20 flex flex-col items-center justify-center text-white z-20 backdrop-blur-sm">
                <span className="text-3xl mb-1">👀</span>
                <span className="font-bold text-sm bg-red-600 px-3 py-1 rounded-full text-center">Please look at the camera</span>
              </div>
            )}

            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium z-10">
                Camera formatting...
              </div>
            )}
            
            {/* Recording Indicator */}
            {listening && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 z-20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs font-bold text-white">Recording</span>
              </div>
            )}
          </div>

          {/* Question Display Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col justify-center overflow-y-auto">
            <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4">Current Question</h4>
            <div className="text-slate-800 leading-relaxed">
              <ReactMarkdown 
                components={{
                  p: ({node, ...props}) => <p className="mb-4 text-lg font-bold" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2 font-medium text-slate-600" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-2 font-medium text-slate-600" {...props} />,
                  code: ({node, inline, ...props}) => <code className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-mono text-sm border border-indigo-100" {...props} />
                }}
              >
                {currentQuestion}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: User Answer Input */}
        <div className="w-full md:w-7/12 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span>✍️</span> Your Response
            </h3>
            
            {/* MICROPHONE TOGGLE BUTTON */}
            <button 
              onClick={toggleListening}
              className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition border ${
                listening 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {listening ? (
                <> <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Stop Recording </>
              ) : (
                <> 🎤 Speak Answer </>
              )}
            </button>
          </div>
          
          {/* 🟢 DYNAMIC RIGHT PANEL (IDE vs Textarea) */}
          <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50">
            {isCodingInterview ? (
              <>
                {/* IDE SECTION */}
                <div className="flex justify-between items-center bg-slate-800 text-slate-300 px-4 py-2 text-xs font-bold uppercase tracking-wider">
                  <span>Code Editor</span>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-slate-700 text-white border border-slate-600 rounded px-2 py-1 outline-none cursor-pointer hover:bg-slate-600 transition"
                  >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                  </select>
                </div>
                <div className="h-3/5 w-full border-b-4 border-slate-200">
                  <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value)}
                    options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                  />
                </div>

                {/* SPOKEN EXPLANATION SECTION */}
                <div className="h-2/5 p-6 flex flex-col relative bg-white">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verbal Explanation</h4>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Click 'Speak Answer' to verbally explain your code approach..."
                    className="flex-1 w-full resize-none outline-none text-slate-700 text-base leading-relaxed placeholder:text-slate-300 bg-transparent relative z-10"
                    disabled={isSubmitting}
                  />
                  {listening && (
                    <div className="absolute bottom-6 right-6 text-sm text-indigo-400 font-medium animate-pulse">
                      Listening to you...
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* STANDARD TEXTAREA (For Behavioral/System Design) */
              <div className="flex-1 p-6 flex flex-col relative bg-white">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here, or click 'Speak Answer' to transcribe your voice..."
                  className="flex-1 w-full resize-none outline-none text-slate-700 text-lg leading-relaxed placeholder:text-slate-300 bg-transparent relative z-10"
                  disabled={isSubmitting}
                />
                {listening && (
                  <div className="absolute bottom-6 right-6 text-sm text-indigo-400 font-medium animate-pulse">
                    Listening to you...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Control Bar */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-500">
              {answer.split(' ').filter(w => w.length > 0).length} words
            </div>
            
            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || (isCodingInterview ? (!answer.trim() && !code.trim()) : !answer.trim())}
              className={`px-8 py-4 rounded-xl font-bold text-white flex items-center gap-3 transition-all ${
                isSubmitting || (isCodingInterview ? (!answer.trim() && !code.trim()) : !answer.trim())
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <> <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Analyzing... </>
              ) : (
                <> Submit Answer <span>→</span> </>
              )}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default InterviewScreen;