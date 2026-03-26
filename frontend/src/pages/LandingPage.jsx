import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import Pricing from '../components/Pricing'; // 1. Import it
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <Features />
        <Pricing /> {/* 2. Add it here */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;