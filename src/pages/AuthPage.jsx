import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // 2. Initialize hook

  // 3. Create a function to handle the form submission
  const handleAuthSubmit = (e) => {
    e.preventDefault(); // Prevents the default HTML form refresh
    // In Phase 2, we will add the real API call to FastAPI here!
    // For now, we simulate success and go to the dashboard:
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* ... Left Side Branding stays exactly the same ... */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-3xl opacity-50"></div>
        <div className="relative z-10">
          <div className="text-3xl font-bold text-white tracking-tight mb-2">IntervAI.</div>
          <p className="text-indigo-200 font-medium">Built for Students • Backed by AI Insights</p>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Your dream job is just a few mock interviews away.
          </h2>
          <div className="bg-indigo-500/30 p-6 rounded-2xl border border-indigo-400/30 backdrop-blur-sm mt-8">
            <p className="text-indigo-100 text-lg italic mb-4">"IntervAI completely changed how I prep for technical rounds. The AI feedback is brutally honest and exactly what I needed."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-400 rounded-full flex items-center justify-center text-white font-bold">A</div>
              <div>
                <div className="text-white font-semibold">Ananya S.</div>
                <div className="text-indigo-200 text-sm">Placed at Top Tech Co.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900">{isLogin ? 'Welcome back' : 'Create an account'}</h2>
            <p className="mt-2 text-sm text-slate-600">{isLogin ? 'Enter your details to access your dashboard.' : 'Start your journey to interview mastery today.'}</p>
          </div>

          {/* 4. Attach the submit handler to the form */}
          <form onSubmit={handleAuthSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition" />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-slate-300 rounded" />
                  <label className="ml-2 block text-sm text-slate-700">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition">Forgot your password?</a>
                </div>
              </div>
            )}

            {/* 5. Ensure button type is "submit" */}
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 font-semibold text-lg transition">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* ... Social buttons and toggle stay the same ... */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-50 text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-slate-700 hover:bg-slate-50 font-medium transition">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none transition">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;