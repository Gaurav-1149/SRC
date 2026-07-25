import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

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

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<InsightPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/insights/${id}`);
        if (!response.ok) {
          throw new Error('Article not found');
        }
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-slate-500 font-medium tracking-wide animate-pulse">Loading article...</p>
      </div>
    );
  }

  // Error / Not Found State
  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h2>
        <p className="text-slate-600 mb-8 max-w-md">The insight you are looking for does not exist or has been removed from our database.</p>
        <Link to="/insight" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm">
          &larr; Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <Link 
          to="/insight" 
          className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors mb-10 group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to all insights
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border bg-slate-50 text-slate-600 border-slate-200 mb-6">
            {article.type}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center text-slate-500 space-x-4 border-b border-slate-100 pb-8">
            <span className="font-semibold text-slate-700 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              By {article.author}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              })}
            </span>
          </div>
        </header>

        {/* Article Body */}
        <article className="prose prose-lg prose-slate max-w-none">
          {/* Excerpt acts as a lead paragraph */}
          <p className="text-xl text-slate-700 leading-relaxed font-medium mb-10 pb-10 border-b border-slate-100">
            {article.excerpt}
          </p>
          
          {/* Main content - uses whitespace-pre-wrap to maintain basic paragraph breaks from the database */}
          <div className="text-slate-800 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </article>
        
        {/* Footer actions */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center">
          <Link 
            to="/insight" 
            className="text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            &larr; Return to Insights
          </Link>
          
        </div>

      </div>
    </div>
  );
}