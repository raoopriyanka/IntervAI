import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/api'; // 1. Import your API functions

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // 2. Add state for our form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 3. Update the submit handler to use the API
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 

    if (isLogin) {
      const response = await loginUser({ email, password });
      if (response.status === "success") {
        // 🟢 SAVE THE NAME TO LOCAL STORAGE
        localStorage.setItem('userName', response.name); 
        navigate('/dashboard');
      } else {
        setErrorMessage(response.detail || "Invalid credentials");
      }
    } else {
      const response = await registerUser({ name, email, password });
      if (response.status === "success") {
        // 🟢 SAVE THE NAME TO LOCAL STORAGE
        localStorage.setItem('userName', response.name);
        navigate('/dashboard');
      } else {
        setErrorMessage(response.detail || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Left Side Branding (Unchanged) */}
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
        </div>
      </div>

      {/* Right Side - Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900">{isLogin ? 'Welcome back' : 'Create an account'}</h2>
            <p className="mt-2 text-sm text-slate-600">{isLogin ? 'Enter your details to access your dashboard.' : 'Start your journey to interview mastery today.'}</p>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition" 
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition" 
                />
              </div>
            </div>

            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 font-semibold text-lg transition">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage(''); // Clear errors when flipping pages
              }} 
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none transition"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;