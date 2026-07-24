import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from "../../public/Logo.png"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Insights', path: '/insight' },
    { name: 'Services', path: '/services' },
    { name: 'Acts/Rules', path: '/acts' },
    { name: 'Contact Us', path: '/contact' },
  ];

  // Helper to check if a link is active based on the current URL
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Area - Using random words as requested */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="h-fit">
              <img src={Logo} alt="" className='h-12 w-fit'/>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${
                  isActive(link.path)
                    ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                } transition-all duration-200 px-3 py-2 text-sm uppercase tracking-wider rounded-t-sm`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-blue-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-md transition-colors"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden bg-white border-t border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`${
                isActive(link.path)
                  ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 border-l-4 border-transparent'
              } block px-4 py-3 rounded-r-md text-base transition-colors`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}