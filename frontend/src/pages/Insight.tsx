import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Added Link for routing

// TypeScript interface matching the backend schema
interface InsightPost {
  _id: string;
  title: string;
  type: string; 
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
}

export default function Insight() {
  const [insights, setInsights] = useState<InsightPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State to track which categories are expanded. 
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('https://src-backend-pq5m.onrender.com/api/insights');
        const data = await response.json();
        setInsights(data);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const toggleSection = (category: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Tax Update': return 'bg-red-50 text-red-600 border-red-100';
      case 'Regulatory Change': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Market Insights': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Case Study': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Firm News': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const groupedInsights = insights.reduce((acc, post) => {
    const category = post.type || 'General Updates';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(post);
    return acc;
  }, {} as Record<string, InsightPost[]>);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Financial Insights
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Stay informed with the latest updates on tax regulations, market trends, and strategic financial planning.
          </p>
          <div className="w-16 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-500 font-medium tracking-wide animate-pulse">Loading latest insights...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Insights Published Yet</h3>
            <p className="text-slate-500">Check back soon for the latest financial updates.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedInsights).map(([category, posts]) => {
              const isExpanded = expandedSections[category];
              const visiblePosts = isExpanded ? posts : posts.slice(0, 4);
              const hasMore = posts.length > 4;

              return (
                <section key={category} className="animate-in fade-in duration-500">
                  
                  <div className="flex items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mr-4">{category}</h2>
                    <div className="h-px bg-slate-300 flex-grow"></div>
                    <span className="ml-4 bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                      {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {visiblePosts.map((post) => (
                      <article 
                        key={post._id} 
                        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 group"
                      >
                        <div className="flex flex-wrap items-center justify-between mb-4">
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getTypeColor(post.type)}`}>
                            {post.type}
                          </span>

                          <div className="flex items-center text-sm font-medium text-slate-500 space-x-4">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors duration-200">
                          {post.title}
                        </h3>
                        
                        <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
                          <span className="text-sm font-semibold text-slate-900">
                            By {post.author}
                          </span>
                          
                          {/* UPDATED: Changed button to Link so routing works */}
                          <Link 
                            to={`/insight/${post._id}`}
                            className="inline-flex items-center text-blue-600 font-bold text-sm uppercase tracking-wider group-hover:text-blue-800 transition-colors duration-200"
                          >
                            Read full article
                            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => toggleSection(category)}
                        className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 shadow-sm text-base font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        {isExpanded ? (
                          <>
                            Show Less
                            <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                            </svg>
                          </>
                        ) : (
                          <>
                            Show {posts.length - 4} More
                            <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}