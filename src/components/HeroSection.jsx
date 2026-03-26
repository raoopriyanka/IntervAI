import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate(); // Initialize the hook

  return (
    <section className="px-8 py-20 md:py-32 max-w-5xl mx-auto text-center">
      {/* ... keeping the top text exactly the same ... */}
      <div className="inline-block bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-indigo-100">
        🚀 AI-Powered Mock Interviews
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
        Convert your knowledge into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 whitespace-nowrap">job offers.</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Stop relying on luck. Practice with real, AI-driven technical and HR interviews. Get actionable feedback on your code, communication, and confidence.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* Added onClick event to trigger navigation */}
        <button 
          onClick={() => navigate('/auth')} 
          className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 text-lg"
        >
          Start Free Interview
        </button>
        <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 font-semibold rounded-xl hover:bg-slate-50 transition text-lg">
          See How It Works
        </button>
      </div>
      
      <p className="mt-8 text-sm text-slate-500 font-medium">
        Built for Students <span className="mx-2">•</span> Backed by AI Insights
      </p>
    </section>
  );
};

export default HeroSection;