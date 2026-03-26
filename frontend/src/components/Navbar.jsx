import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-slate-200">
      <div className="text-2xl font-bold text-indigo-600 tracking-tight">
        IntervAI<span className="text-slate-800">.</span>
      </div>
      <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
        <a href="#features" className="hover:text-indigo-600 transition">Features</a>
        <a href="#pricing" className="hover:text-indigo-600 transition">Pricing</a>
        <a href="#b2b" className="hover:text-indigo-600 transition flex items-center gap-1">
          For Colleges <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">New</span>
        </a>
      </div>
      <div className="flex space-x-4">
        {/* Changed to React Router Links */}
        <Link to="/auth" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition mt-2">Log in</Link>
        <Link to="/auth" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm">
          Get Started Free
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;