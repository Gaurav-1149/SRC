import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

interface InsightPost {
  _id: string;
  title: string;
  type: string;
  publishedAt: string;
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login State
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Manage Insights State
  const [existingInsights, setExistingInsights] = useState<InsightPost[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Post State
  const [postData, setPostData] = useState({
    title: '',
    type: 'Tax Update',
    excerpt: '',
    content: '',
    author: 'NebulaCactus Advisory'
  });
  const [postStatus, setPostStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Check login session
  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch insights when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchInsights();
    }
  }, [isLoggedIn]);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/insights`);
      const data = await response.json();
      setExistingInsights(data);
    } catch (error) {
      console.error('Failed to fetch insights for management');
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        sessionStorage.setItem('adminAuth', 'true');
      } else {
        setLoginError('Invalid username or password.');
      }
    } catch (error) {
      setLoginError('Server error. Ensure your Express backend is running.');
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostStatus('loading');

    try {
      const response = await fetch(`${API_BASE_URL}/api/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        setPostStatus('success');
        setPostData({ title: '', type: 'Tax Update', excerpt: '', content: '', author: 'NebulaCactus Advisory' });
        fetchInsights(); // Refresh the list of insights
        setTimeout(() => setPostStatus('idle'), 3000); 
      } else {
        setPostStatus('error');
      }
    } catch (error) {
      setPostStatus('error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    // Prevent accidental clicks
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/insights/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted insight from the UI without reloading the page
        setExistingInsights(prev => prev.filter(insight => insight._id !== id));
      } else {
        alert('Failed to delete the insight.');
      }
    } catch (error) {
      alert('Error connecting to the server.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsLoggedIn(false);
    setCredentials({ username: '', password: '' });
  };

  // --- LOGIN UI ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Sign in to manage your website content
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-200">
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200 flex items-center">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {loginError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
                <input 
                  type="text" 
                  required 
                  value={credentials.username} 
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} 
                  className="block w-full rounded-lg border border-slate-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-shadow" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required 
                  value={credentials.password} 
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
                  className="block w-full rounded-lg border border-slate-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-shadow" 
                />
              </div>
              <button 
                type="submit" 
                className="flex w-full justify-center items-center rounded-lg border border-transparent bg-slate-900 py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors"
              >
                Sign in to Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-500">Manage and publish content</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-sm font-semibold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center w-full sm:w-auto justify-center"
          >
            Logout
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>

        {/* Create Post Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Publish New Insight</h2>
          
          {postStatus === 'success' && (
             <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center animate-in fade-in duration-300">
               <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>
               <span className="font-medium">Insight published successfully!</span>
             </div>
          )}
          
          {postStatus === 'error' && (
             <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center animate-in fade-in duration-300">
               <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>
               <span className="font-medium">Failed to publish insight. Check your backend connection.</span>
             </div>
          )}

          <form onSubmit={handlePostSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Article Title</label>
              <input 
                type="text" required value={postData.title} onChange={(e) => setPostData({...postData, title: e.target.value})} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                placeholder="e.g., New Income Tax Slabs Explained" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category Type</label>
                <select 
                  required value={postData.type} onChange={(e) => setPostData({...postData, type: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer"
                >
                  <option value="Tax Update">Tax Update</option>
                  <option value="Regulatory Change">Regulatory Change</option>
                  <option value="Market Insights">Market Insights</option>
                  <option value="Case Study">Case Study</option>
                  <option value="Firm News">Firm News</option>
                  <option value="General Updates">General Updates</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Author Name</label>
                <input 
                  type="text" required value={postData.author} onChange={(e) => setPostData({...postData, author: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Excerpt (Short Summary)</label>
              <textarea 
                required rows={2} value={postData.excerpt} onChange={(e) => setPostData({...postData, excerpt: e.target.value})} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none" 
                placeholder="A brief 1-2 sentence summary." 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Content</label>
              <textarea 
                required rows={8} value={postData.content} onChange={(e) => setPostData({...postData, content: e.target.value})} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-y" 
                placeholder="Write the full article here..." 
              />
            </div>

            <button 
              type="submit" disabled={postStatus === 'loading'} 
              className="w-full py-4 px-6 flex justify-center items-center text-white font-bold rounded-lg transition-all text-lg disabled:bg-blue-400 bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              {postStatus === 'loading' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                'Publish Insight'
              )}
            </button>
          </form>
        </div>

        {/* Manage Existing Posts Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Manage Existing Insights</h2>
          
          {loadingInsights ? (
            <div className="text-center py-8 text-slate-500 flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading insights...
            </div>
          ) : existingInsights.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No insights found in the database.</div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {existingInsights.map((insight) => (
                <div key={insight._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors">
                  <div className="mb-4 sm:mb-0 pr-4">
                    <h3 className="font-bold text-slate-900">{insight.title}</h3>
                    <div className="flex items-center text-sm text-slate-500 mt-2">
                      <span className="bg-white px-2.5 py-1 rounded-md text-xs font-semibold border border-slate-200 mr-3 uppercase tracking-wide text-slate-600">
                        {insight.type}
                      </span>
                      {new Date(insight.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(insight._id, insight.title)}
                    className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}