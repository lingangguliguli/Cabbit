// React concepts: useState, controlled components, Context API, conditional rendering

import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cardStyle = {
  background: '#0d1117',
  border: '1px solid #1e2535',
  borderRadius: '20px',
  padding: '36px 32px',
  width: '100%',
  maxWidth: '420px',
  boxShadow: '0 0 60px rgba(59,130,246,0.1)',
};

const inputStyle = {
  width: '100%',
  background: '#161b27',
  border: '1.5px solid #1e2535',
  borderRadius: '12px',
  padding: '13px 16px',
  color: '#f0f6fc',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'all 0.2s ease',
};

const googleButtonStyle = {
  width: '100%',
  background: '#161b27',
  border: '1.5px solid #1e2535',
  borderRadius: '12px',
  padding: '13px',
  color: '#f0f6fc',
  fontSize: '14px',
  fontWeight: '500',
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  transition: 'all 0.2s ease',
};

const submitButtonStyle = {
  width: '100%',
  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
  border: 'none',
  borderRadius: '12px',
  padding: '14px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700',
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  marginTop: '8px',
  transition: 'all 0.2s ease',
  boxShadow: '0 0 20px rgba(59,130,246,0.35)',
  letterSpacing: '0.01em',
};

const errorStyle = {
  background: 'rgba(239,68,68,0.1)',
  border: '1px solid rgba(239,68,68,0.25)',
  borderRadius: '10px',
  padding: '10px 14px',
  color: '#f87171',
  fontSize: '13px',
  marginBottom: '12px',
  lineHeight: '1.5',
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" />
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.77-2.7.77-2.08 0-3.84-1.4-4.47-3.29H1.88v2.07A8 8 0 008.98 17z" />
      <path fill="#FBBC05" d="M4.51 10.53A4.8 4.8 0 014.26 9c0-.53.09-1.04.25-1.53V5.4H1.88A8 8 0 001 9c0 1.3.31 2.52.88 3.6l2.63-2.07z" />
      <path fill="#EA4335" d="M8.98 3.58c1.18 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.88 5.4L4.51 7.47c.63-1.89 2.39-3.3 4.47-3.3z" />
    </svg>
  );
}

function applyInputFocus(event) {
  event.target.style.borderColor = '#3b82f6';
  event.target.style.background = '#1a2030';
  event.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
}

function applyInputBlur(event) {
  event.target.style.borderColor = '#1e2535';
  event.target.style.background = '#161b27';
  event.target.style.boxShadow = 'none';
}

export default function Login() {
  const { currentUser, login, loginWithGoogle, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (currentUser) return <Navigate to={from} replace />;

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      // AuthContext owns the visible authError message.
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch {
      // AuthContext owns the visible authError message.
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cab-bg px-4 py-12">
      <div className="pointer-events-none fixed left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cab-blue/10 blur-3xl" />
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '6px', fontSize: '36px' }}>🐇</div>
        <h1
          style={{
            textAlign: 'center',
            color: '#f0f6fc',
            fontSize: '22px',
            fontWeight: '800',
            marginBottom: '6px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Welcome back
        </h1>
        <p style={{ textAlign: 'center', color: '#8b949e', fontSize: '13px', marginBottom: '24px' }}>
          New to Cabbit?{' '}
          <Link to="/signup" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
            Create an account
          </Link>
        </p>

        {authError && <div style={errorStyle}>⚠️ {authError}</div>}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ ...googleButtonStyle, opacity: loading ? 0.7 : 1 }}
          onMouseEnter={(event) => {
            event.currentTarget.style.borderColor = '#2d3a52';
            event.currentTarget.style.background = '#1a2030';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.borderColor = '#1e2535';
            event.currentTarget.style.background = '#161b27';
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#1e2535' }} />
          <span style={{ color: '#484f58', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#1e2535' }} />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={inputStyle}
            onFocus={applyInputFocus}
            onBlur={applyInputBlur}
            required
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={{ ...inputStyle, paddingRight: '48px' }}
              onFocus={applyInputFocus}
              onBlur={applyInputBlur}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((show) => !show)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#484f58',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.color = '#8b949e';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = '#484f58';
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ ...submitButtonStyle, opacity: loading ? 0.75 : 1 }}
            onMouseEnter={(event) => {
              event.currentTarget.style.boxShadow = '0 0 30px rgba(59,130,246,0.55)';
              event.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.35)';
              event.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'Please wait...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
