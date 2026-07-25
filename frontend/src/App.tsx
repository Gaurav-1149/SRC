import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Acts from './pages/Acts';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Insight from './pages/Insight';
import Article from './pages/Article';
import Admin from './pages/Admin';


export default function App() {
  return (
    <Router>
      
      <div className="flex flex-col min-h-screen bg-slate-50">
        {/* The Navbar remains sticky at the top of every page */}
        <Navbar />
        
        {/* Main content area that grows to fill available space */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/insight" element={<Insight />} />
            <Route path="/insight/:id" element={<Article />} />
            <Route path="/services" element={<Services />} />
            <Route path="/acts" element={<Acts />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin/>} />
          </Routes>
        </main>

        {/* A simple universal footer to complete the layout */}
        <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-slate-400">
              © {new Date().getFullYear()} NebulaCactus CA Firm. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}