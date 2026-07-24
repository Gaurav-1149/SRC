import actsData from '../data/acts.json';

export default function Acts() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Key Legislative Acts
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Quick reference links to the fundamental legal and regulatory frameworks governing our practice and your business.
          </p>
          <div className="w-16 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Acts List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {actsData.map((act) => (
              <li key={act.id} className="hover:bg-slate-50 transition-colors duration-200">
                <a 
                  href={act.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 w-full text-left group"
                >
                  <div className="flex items-center space-x-5">
                    {/* Document Icon */}
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    
                    {/* Act Name */}
                    <span className="text-lg font-semibold text-slate-800 group-hover:text-blue-700 transition-colors duration-200">
                      {act.name}
                    </span>
                  </div>
                  
                  {/* External Link Arrow */}
                  <div className="text-slate-300 group-hover:text-blue-600 transition-colors duration-200 flex-shrink-0 ml-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}