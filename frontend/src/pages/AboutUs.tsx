import clientsData from '../data/clients.json';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* 1. Profile Section - Celebrating 20 Years */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-b border-slate-100">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Paragraph */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Firm Profile
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              For two decades, NebulaCactus has been at the forefront of financial advisory, audit, and tax consulting. What started as a small practice has grown into a premier Chartered Accountant firm dedicated to driving business growth, ensuring stringent compliance, and delivering actionable financial intelligence.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our commitment to integrity and client success remains the cornerstone of our practice. We partner with businesses of all sizes, translating complex regulatory frameworks into clear, strategic advantages to secure your financial future.
            </p>
          </div>
          
          {/* Right Side: 20 Years Graphic */}
          <div className="flex justify-center items-center mt-10 md:mt-0">
            <div className="relative w-72 h-72 rounded-full bg-blue-50 border-[12px] border-blue-100 flex flex-col items-center justify-center shadow-sm">
              <span className="text-blue-600 font-extrabold text-8xl tracking-tighter">
                20
              </span>
              <span className="text-slate-800 font-bold text-2xl tracking-widest uppercase mt-2">
                Years
              </span>
              <span className="text-blue-500 font-medium text-sm tracking-widest uppercase mt-1">
                Celebrating Excellence
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Team Section */}
      <section className="py-24 px-4 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Leadership Team</h2>
            <div className="w-16 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
          </div>
          
          {/* Team Member Card */}
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            
            {/* Blank space for image */}
            <div className="h-80 bg-slate-200 flex items-center justify-center border-b border-slate-100">
              <span className="text-slate-400 font-medium tracking-wider uppercase text-sm">
                [ Image Placeholder ]
              </span>
            </div>
            
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-slate-900">Julian Sterling</h3>
              <p className="text-blue-600 font-semibold mt-2 mb-5 uppercase tracking-wide text-sm">
                Founder & Managing Partner, FCA
              </p>
              <p className="text-slate-600 leading-relaxed">
                With over 25 years of experience in corporate taxation, statutory audits, and financial restructuring, Julian leads the firm's strategic vision. He ensures every client receives top-tier, personalized financial counsel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Clients Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Valued Clients</h2>
          <div className="w-16 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
            We are proud to partner with industry leaders and innovative businesses across the globe.
          </p>
        </div>
        
        {/* Client Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clientsData.map((client) => (
            <div 
              key={client.id} 
              className="bg-white border border-slate-200 py-8 px-4 rounded-xl text-center shadow-sm hover:border-blue-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              <span className="text-slate-700 font-bold tracking-wide">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}