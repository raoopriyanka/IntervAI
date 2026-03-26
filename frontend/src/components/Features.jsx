const Features = () => {
  const features = [
    {
      title: "Behavioral & Technical",
      description: "A combined environment. Answer HR questions via audio/video and solve DSA problems in an integrated IDE.",
      icon: "🧠"
    },
    {
      title: "Unbiased AI Feedback",
      description: "Our NLP and Speech-to-Text engine evaluates your response length, filler words, and technical accuracy instantly.",
      icon: "⚡"
    },
    {
      title: "Placement Readiness Score",
      description: "Data-driven analytics track your improvement over time. Perfect for individuals, essential for college placement cells.",
      icon: "📈"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-3xl font-bold text-center mb-16">Why IntervAI is hard to beat</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;