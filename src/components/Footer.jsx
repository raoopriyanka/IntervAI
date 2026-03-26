const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-bold text-white mb-4 md:mb-0">IntervAI.</div>
        <div className="space-x-6 text-sm">
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;