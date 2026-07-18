import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import StartInterview from './pages/StartInterview'; 
import InterviewScreen from './pages/InterviewScreen';
import FeedbackScreen from './pages/FeedbackScreen';
import PracticeBank from './pages/PracticeBank'; // adjust path if needed
import InterviewHistory from './pages/InterviewHistory';

// ... rest of your code

// ... inside your <Routes> component:


// ... inside your <Routes>


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview/start" element={<StartInterview />} /> {/* 2. Add route */}
          <Route path="/interview/start" element={<StartInterview />} />
          <Route path="/interview/results" element={<FeedbackScreen />} />
          <Route path="/interview/active" element={<InterviewScreen />} />
          <Route path="/practice" element={<PracticeBank />} />
          <Route path="/history" element={<InterviewHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;