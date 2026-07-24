import { useState, useEffect } from 'react';
import servicesData from '../data/services.json';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide logic for the hero section
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % servicesData.length);
    }, 5000); // Changes the service every 5 seconds

    // Cleanup the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  // Data for the "Why Choose Us" section
  const whyChooseUsData = [
    {
      title: "Proactive Compliance",
      description: "We keep you ahead of the curve on regulatory changes, including updates to GST and the latest challan rules."
    },
    {
      title: "Strategic Accuracy",
      description: "Every audit and tax filing is executed with meticulous attention to detail to minimize your financial risk."
    },
    {
      title: "Client-Centric Advisory",
      description: "We don't just crunch numbers; we provide actionable insights to fuel your long-term business growth."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Services Hero Card (Auto Slides) */}
      <section className="relative h-[60vh] min-h-[450px] bg-slate-900 flex items-center justify-center overflow-hidden px-4">
        {servicesData.map((service, index) => (
          <div
            key={service.id}
            className={`absolute transition-opacity duration-1000 ease-in-out text-center max-w-4xl mx-auto w-full ${
              index === currentSlide ? 'opacity-100 relative z-10' : 'opacity-0 z-0'
            }`}
          >
            <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm mb-4 block">
              Featured Service
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {service.name}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto px-4">
              {service.description}
            </p>
          </div>
        ))}
        
        {/* Slider Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {servicesData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentSlide ? 'bg-blue-500 w-6' : 'bg-slate-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2 & 3. Vision and Mission */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Vision Card */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              To be the most trusted financial advisory firm, empowering businesses with clear, strategic, and innovative accounting solutions that foster sustainable growth and operational excellence.
            </p>
          </div>
          
          {/* Mission Card - Uses a dark background for contrast */}
          <div className="bg-slate-800 p-10 rounded-2xl shadow-sm text-white hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-4 text-blue-400">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              We provide uncompromising quality in audit, taxation, and advisory services. We commit to maintaining the highest standards of professional integrity while delivering personalized strategies to secure our clients' financial futures.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-20 bg-white px-4 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Choose Us</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {whyChooseUsData.map((item, index) => (
              <div key={index} className="text-center px-4">
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  {/* Numbered icon placeholder */}
                  <span className="text-blue-600 text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}