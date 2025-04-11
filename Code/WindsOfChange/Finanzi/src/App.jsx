import './App.css'
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingDashboard from './components/LandingDashboard';
import MinistryView from './components/MinistryView';
import VoteDetailView from './components/VoteDetailView';
import BudgetSearch from './components/BudgetSearch';

function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScrollPos / scrollHeight) * 100);
      setIsScrolled(currentScrollPos > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-container">
      {/* Progress bar */}
      <div 
        className="progress-bar" 
        style={{ transform: `scaleX(${scrollProgress / 100})` }} 
      />

      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <Link to="/" className="logo" onClick={() => setNavOpen(false)}>
            <span className="logo-icon">💰</span>
            <span className="logo-text fade-in">Malta Budget 2025 Explorer</span>
          </Link>
          
          <div className="header-controls">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/search" className="nav-link">Search</Link>
              <button 
                onClick={toggleTheme}
                className="theme-toggle-header"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
            </nav>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-3">
              <button 
                onClick={toggleTheme}
                className="theme-toggle-header"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              <button 
                onClick={() => setNavOpen(!navOpen)}
                className="burger-menu"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={navOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {navOpen && (
          <div className="md:hidden">
            <nav className="mobile-nav slide-in">
              <ul className="nav-menu-mobile">
                <li>
                  <Link 
                    to="/" 
                    className="nav-link-mobile"
                    onClick={() => setNavOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/search" 
                    className="nav-link-mobile"
                    onClick={() => setNavOpen(false)}
                  >
                    Search
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>
      
      <main className="main-content fade-in">
        <Routes>
          <Route path="/" element={<LandingDashboard />} />
          <Route path="/ministry/:ministryId" element={<MinistryView />} />
          <Route path="/ministry/:ministryId/vote/:voteName" element={<VoteDetailView />} />
          <Route path="/search" element={<BudgetSearch />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">Data based on Malta Budget 2025 Estimates. Not official government data.</p>
          <p className="footer-copyright">© {new Date().getFullYear()} Malta Budget Explorer</p>
        </div>
      </footer>
    </div>
  )
}

export default App
