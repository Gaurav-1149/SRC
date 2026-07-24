import servicesData from '../data/services.json';

export default function Services() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Our Expertise
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive financial, auditing, and tax solutions tailored to secure your business's future and ensure strict regulatory compliance.
          </p>
          <div className="w-16 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div 
              key={service.id} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
            >
              {/* Dynamic Icon Wrapper */}
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-blue-100 group-hover:border-blue-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors duration-200">
                {service.name}
              </h3>
              
              {/* flex-grow pushes the footer down so all cards match height */}
              <p className="text-slate-600 leading-relaxed flex-grow">
                {service.description}
              </p>
              
              {/* Card Footer */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <span className="inline-flex items-center text-blue-600 font-bold text-sm uppercase tracking-wider group-hover:text-blue-700 cursor-pointer transition-colors duration-200">
                  Learn More
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}