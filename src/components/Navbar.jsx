// React concepts: Context API, conditional rendering, useState, useRef, useEffect

import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Compare', to: '/compare' },
  { label: 'Saved', to: '/saved' },
  { label: 'History', to: '/history' },
];

const signUpButtonStyle = {
  background: 'transparent',
  border: '1.5px solid #3b82f6',
  color: '#3b82f6',
  borderRadius: '10px',
  padding: '7px 18px',
  fontSize: '13px',
  fontWeight: '600',
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  letterSpacing: '0.01em',
};

const loginButtonStyle = {
  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
  border: '1.5px solid transparent',
  color: '#ffffff',
  borderRadius: '10px',
  padding: '7px 18px',
  fontSize: '13px',
  fontWeight: '600',
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  letterSpacing: '0.01em',
  boxShadow: '0 0 16px rgba(59,130,246,0.3)',
};

const getNavLinkClass = ({ isActive }) =>
  isActive
    ? 'relative text-[#3b82f6] font-semibold after:content-[""] after:absolute after:bottom-[-20px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#3b82f6] after:rounded-full'
    : 'text-[#8b949e] font-medium hover:text-[#f0f6fc] transition-colors';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initial = (currentUser?.displayName || currentUser?.email || 'C').charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-cab-border/50 bg-cab-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🐇</span>
          <span className="text-xl font-black tracking-tight">
            <span className="text-cab-text">Cab</span>
            <span className="text-cab-blue">bit</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={getNavLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!currentUser ? (
            <>
              <Link to="/signup">
                <button
                  type="button"
                  style={signUpButtonStyle}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                    event.currentTarget.style.borderColor = '#60a5fa';
                    event.currentTarget.style.color = '#60a5fa';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = 'transparent';
                    event.currentTarget.style.borderColor = '#3b82f6';
                    event.currentTarget.style.color = '#3b82f6';
                  }}
                >
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button
                  type="button"
                  style={loginButtonStyle}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.boxShadow = '0 0 24px rgba(59,130,246,0.5)';
                    event.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.boxShadow = '0 0 16px rgba(59,130,246,0.3)';
                    event.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Log In
                </button>
              </Link>
            </>
          ) : (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cab-blue to-cab-cyan text-sm font-black text-white shadow-blue-sm"
                aria-label="Open profile menu"
              >
                {initial}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-xl border border-cab-border bg-cab-surface p-2 shadow-xl">
                  <Link to="/profile" className="block rounded-lg px-3 py-2 text-sm text-cab-muted hover:bg-cab-elevated hover:text-cab-text">
                    👤 Profile
                  </Link>
                  <Link to="/saved" className="block rounded-lg px-3 py-2 text-sm text-cab-muted hover:bg-cab-elevated hover:text-cab-text">
                    🔖 Saved Routes
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-cab-muted hover:bg-cab-elevated hover:text-cab-text"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-lg p-2 text-cab-muted hover:bg-cab-elevated hover:text-cab-text md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-b border-cab-border bg-cab-surface px-4 py-4 shadow-xl md:hidden">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-cab-elevated text-cab-blue' : 'text-cab-muted hover:bg-cab-elevated hover:text-cab-text'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-cab-border pt-3">
              {!currentUser ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>
                    <button type="button" style={{ ...signUpButtonStyle, width: '100%' }}>
                      Sign Up
                    </button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <button type="button" style={{ ...loginButtonStyle, width: '100%' }}>
                      Log In
                    </button>
                  </Link>
                </div>
              ) : (
                <button type="button" onClick={handleLogout} className="w-full rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400">
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
