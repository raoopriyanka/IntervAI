import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestFeedback } from '../services/api';

const FeedbackScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      // Attempt to fetch real data from your backend
      const data = await getLatestFeedback();
      
      if (data && data.status === "success") {
        setFeedback(data.feedback);
      } else {
        // 🟢 MOCK DATA FALLBACK: So you can see the UI while testing
        setFeedback({
          overallScore: 82,
          summary: "You demonstrated a strong understanding of core concepts, particularly in React and state management. However, your explanations could be more structured. Try using the STAR method (Situation, Task, Action, Result) for behavioral questions.",
          metrics: [
            { name: "Technical Accuracy", score: 90, color: "bg-emerald-500", text: "text-emerald-600" },
            { name: "Communication", score: 75, color: "bg-amber-500", text: "text-amber-600" },
            { name: "Confidence & Delivery", score: 80, color: "bg-indigo-500", text: "text-indigo-600" }
          ],
          qna: [
            {
              id: 1,
              question: "Tell me about a time you had to optimize the performance of a React application.",
              userAnswer: "I used React.memo to stop components from re-rendering and lazy loaded images.",
              aiFeedback: "Good start, but you missed explaining *why* the app was slow in the first place. Next time, mention how you profiled the app using React DevTools before applying fixes.",
              score: 70
            },
            {
              id: 2,
              question: "How do you manage global state in a complex frontend application?",
              userAnswer: "I usually prefer Redux Toolkit because it cuts down boilerplate, but sometimes I just use Context API if the app is small and doesn't update too often.",
              aiFeedback: "Excellent answer. You showed that you understand the trade-offs between different tools rather than just picking one blindly. Very senior-level mindset.",
              score: 95
            }
          ]
        });
      }
      setLoading(false);
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-slate-700">Generating Nova AI Analysis...</h2>
      </div>
    );
  }

  if (!feedback) return <div className="p-8 text-center text-red-500">Failed to load feedback.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      
      {/* 🟢 HEADER */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tight">IntervAI.</h1>
          <span className="h-6 w-px bg-slate-200 hidden md:block"></span>
          <h2 className="text-lg font-bold text-slate-700 hidden md:block">Interview Results</h2>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
        >
          Back to Dashboard
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-8 mt-4 space-y-8">
        
        {/* 🟢 TOP SECTION: SCORE & SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Overall Score Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center col-span-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Overall Score</h3>
            
            {/* Cool CSS Circle */}
            <div className="relative w-40 h-40 flex items-center justify-center rounded-full bg-slate-50 mb-6 shadow-inner border-8 border-slate-100">
              {/* Dynamic colored ring based on score */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="72" fill="none" className="stroke-slate-100" strokeWidth="8" />
                <circle cx="80" cy="80" r="72" fill="none" 
                  className={feedback.overallScore >= 80 ? 'stroke-emerald-500' : feedback.overallScore >= 60 ? 'stroke-amber-500' : 'stroke-red-500'} 
                  strokeWidth="8" 
                  strokeDasharray={`${(feedback.overallScore / 100) * 452} 452`} 
                  strokeLinecap="round" 
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-5xl font-black text-slate-800">{feedback.overallScore}</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
            </div>
            
            <p className="font-bold text-slate-700">
              {feedback.overallScore >= 80 ? "🔥 Outstanding performance!" : feedback.overallScore >= 60 ? "👍 Good effort, room to grow." : "💪 Keep practicing!"}
            </p>
          </div>

          {/* AI Summary & Metrics */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🧠</span>
                <h3 className="text-xl font-bold text-slate-800">Nova AI's Final Assessment</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-8">
                {feedback.summary}
              </p>
            </div>

            {/* Metric Bars */}
            <div className="space-y-5">
              {feedback.metrics.map((metric, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                    <span>{metric.name}</span>
                    <span className={metric.text}>{metric.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className={`${metric.color} h-3 rounded-full`} style={{ width: `${metric.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🟢 DETAILED Q&A BREAKDOWN */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 pl-2">Question Breakdown</h3>
          
          {feedback.qna.map((item, index) => (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* Question Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{item.question}</h4>
                </div>
                <div className={`ml-auto px-3 py-1 rounded-lg text-sm font-bold shrink-0 ${
                  item.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.score}/100
                </div>
              </div>

              {/* Answers & Feedback */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* User Answer */}
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span>🗣️</span> Your Answer
                  </h5>
                  <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed border border-slate-100">
                    "{item.userAnswer}"
                  </div>
                </div>

                {/* AI Feedback */}
                <div>
                  <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span>💡</span> AI Feedback
                  </h5>
                  <div className="bg-indigo-50/50 p-4 rounded-xl text-indigo-900 text-sm leading-relaxed border border-indigo-100">
                    {item.aiFeedback}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default FeedbackScreen;