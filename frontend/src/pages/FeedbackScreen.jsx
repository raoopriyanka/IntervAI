import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { BASE_URL } from '../services/api'; // 🟢 NEW: Import your dynamic base URL

const FeedbackScreen = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealResults = async () => {
      try {
        const token = localStorage.getItem("token");
        // 🟢 FIXED: Using dynamic BASE_URL for future deployment!
        const response = await fetch(`${BASE_URL}/get-feedback`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.status === "success") {
          setFeedbackData(data.feedback);
        }
      } catch (error) {
        console.error("Failed to load feedback", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealResults();
  }, []);

  const renderUserAnswer = (rawAnswer) => {
    if (rawAnswer.includes('[WRITTEN CODE -')) {
      const parts = rawAnswer.split('[VERBAL EXPLANATION]');
      const codePart = parts[0].replace(/\[WRITTEN CODE - .*?\]\n/, '').trim();
      const verbalPart = parts[1] ? parts[1].trim() : 'No verbal explanation provided.';
      
      const langMatch = rawAnswer.match(/\[WRITTEN CODE - (.*?)\]/);
      const lang = langMatch ? langMatch[1] : 'CODE';

      return (
        <div className="flex flex-col gap-4 mt-2">
          <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            <div className="bg-slate-800 px-4 py-1.5 border-b border-slate-700 text-xs font-bold text-slate-400">
              {lang}
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-emerald-400 leading-relaxed">
              <code>{codePart}</code>
            </pre>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1 block">🎤 Transcript</span>
            <p className="text-slate-700 italic">"{verbalPart}"</p>
          </div>
        </div>
      );
    }
    return <p className="text-slate-700 text-lg leading-relaxed mt-2">"{rawAnswer}"</p>;
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-bold text-slate-700">Analyzing Your Performance...</h2>
    </div>
  );

  if (!feedbackData) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <h2 className="text-xl font-bold text-red-500">Failed to load feedback.</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-indigo-600 text-white pt-16 pb-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate('/dashboard')} className="text-indigo-200 hover:text-white flex items-center gap-2 mb-8 transition font-bold text-sm">
            <span>←</span> Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Interview Results</h1>
              <p className="text-indigo-200 text-lg max-w-xl leading-relaxed">{feedbackData.summary}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-center min-w-[180px] shadow-xl">
              <span className="block text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">Overall Score</span>
              <span className="text-6xl font-black text-white">{feedbackData.overallScore}</span>
            </div>
          </div>

          {/* 🟢 NEW: Skills Breakdown row using the Backend Data! */}
          {feedbackData.metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-indigo-500/50 pt-8">
              {feedbackData.metrics.map((metric, idx) => (
                <div key={idx} className="bg-indigo-700/50 rounded-2xl p-4 flex items-center justify-between border border-indigo-500/30">
                  <span className="font-bold text-indigo-100">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-indigo-900 rounded-full overflow-hidden">
                      <div className={`h-full ${metric.color || 'bg-emerald-400'}`} style={{ width: `${metric.score}%` }}></div>
                    </div>
                    <span className="font-black text-white w-8 text-right">{metric.score}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 -mt-10">
        <h3 className="text-2xl font-black text-slate-800 mb-6 mt-12">Question Breakdown</h3>
        <div className="space-y-8">
          {feedbackData.qna.map((item, index) => (
            <div key={item.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              
              {/* Question Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <div className="text-xl font-bold text-slate-800 leading-snug">
                    <ReactMarkdown 
                      components={{
                        p: ({node, ...props}) => <p className="mb-2" {...props} />,
                        code: ({node, inline, ...props}) => <code className="bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded font-mono text-sm" {...props} />
                      }}
                    >
                      {item.question}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl font-bold text-sm shrink-0 flex items-center justify-center ${
                  item.score >= 90 ? 'bg-emerald-100 text-emerald-700' : 
                  item.score >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.score}/100
                </div>
              </div>

              {/* Answers & Feedback Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Parsed User Answer */}
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <span>🗣️</span> Your Answer
                  </h4>
                  {renderUserAnswer(item.userAnswer)}
                </div>

                {/* AI Feedback */}
                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <span>💡</span> AI Feedback
                  </h4>
                  <p className="text-indigo-900 leading-relaxed font-medium">
                    {item.aiFeedback}
                  </p>
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