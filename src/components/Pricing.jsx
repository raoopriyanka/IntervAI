const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Simple, scalable pricing.</h2>
          <p className="text-lg text-slate-600">Start for free, upgrade when you need more practice, or bring IntervAI to your entire college campus.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Tier 1: Free */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Basic Student</h3>
            <p className="text-slate-500 text-sm mb-6">Perfect for trying out the platform.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">₹0</span>
              <span className="text-slate-500 font-medium">/forever</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-600 text-sm"><span className="mr-3 text-indigo-500">✓</span> 3 Mock Interviews</li>
              <li className="flex items-center text-slate-600 text-sm"><span className="mr-3 text-indigo-500">✓</span> Basic AI Feedback</li>
              <li className="flex items-center text-slate-600 text-sm"><span className="mr-3 text-indigo-500">✓</span> Community Support</li>
            </ul>
            <button className="w-full py-3 px-4 bg-slate-100 text-slate-800 font-semibold rounded-xl hover:bg-slate-200 transition">
              Get Started Free
            </button>
          </div>

          {/* Tier 2: Pro (Highlighted) */}
          <div className="bg-indigo-600 rounded-2xl p-8 border border-indigo-500 shadow-xl shadow-indigo-200 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-400 to-indigo-400 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pro Student</h3>
            <p className="text-indigo-200 text-sm mb-6">For serious placement preparation.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">₹299</span>
              <span className="text-indigo-200 font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-white text-sm"><span className="mr-3 text-indigo-300">✓</span> Unlimited Mock Interviews</li>
              <li className="flex items-center text-white text-sm"><span className="mr-3 text-indigo-300">✓</span> Advanced Analytics & DSA Tracking</li>
              <li className="flex items-center text-white text-sm"><span className="mr-3 text-indigo-300">✓</span> Company-specific Prep (FAANG)</li>
              <li className="flex items-center text-white text-sm"><span className="mr-3 text-indigo-300">✓</span> Resume Review & Roadmap</li>
            </ul>
            <button className="w-full py-3 px-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-slate-50 transition shadow-sm">
              Upgrade to Pro
            </button>
          </div>

          {/* Tier 3: B2B College */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2">For Colleges 🏫</h3>
            <p className="text-slate-500 text-sm mb-6">Empower your placement cell.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">Custom</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-600 text-sm"><span className="mr-3 text-indigo-500">✓</span> Dashboard for all students</li>
              <li className="flex items-center text-slate-600 text-sm"><span className="mr-3 text-indigo-500">✓</span> Track Placement Readiness Score</li>
              <li className="flex items-center text-slate-600 text-sm"><span className="mr-3 text-indigo-500">✓</span> Find who is ready vs. who needs help</li>
            </ul>
            <button className="w-full py-3 px-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition">
              Contact Sales
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Pricing;