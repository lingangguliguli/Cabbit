// React concepts: useState, useEffect, Context API, controlled forms, async/await

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useFirestore from '../hooks/useFirestore';

const greenButtonStyle = {
  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
  border: 'none',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '11px 24px',
  minHeight: '42px',
  fontSize: '14px',
  fontWeight: '700',
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  letterSpacing: '0.02em',
  boxShadow: '0 0 20px rgba(34,197,94,0.35)',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
};

const destructiveButtonStyle = {
  background: 'transparent',
  border: '1.5px solid rgba(239,68,68,0.3)',
  color: '#ef4444',
  borderRadius: '10px',
  padding: '10px 20px',
  minHeight: '42px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

function applyGreenHover(event) {
  event.currentTarget.style.boxShadow = '0 0 30px rgba(34,197,94,0.55)';
  event.currentTarget.style.transform = 'translateY(-1px)';
  event.currentTarget.style.background = 'linear-gradient(135deg, #22c55e, #4ade80)';
}

function resetGreenHover(event) {
  event.currentTarget.style.boxShadow = '0 0 20px rgba(34,197,94,0.35)';
  event.currentTarget.style.transform = 'translateY(0)';
  event.currentTarget.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
}

function applyDestructiveHover(event) {
  event.currentTarget.style.background = 'rgba(239,68,68,0.08)';
  event.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
}

function resetDestructiveHover(event) {
  event.currentTarget.style.background = 'transparent';
  event.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
}

export default function Profile() {
  const { currentUser, logout, updateDisplayName: updateAuthDisplayName } = useAuth();
  const { getUserStats, updateDisplayName: updateFirestoreDisplayName } = useFirestore();
  const displayName = currentUser?.displayName || 'User';
  const email = currentUser?.email || '';
  const photoURL = currentUser?.photoURL;
  const [name, setName] = useState(displayName);
  const [stats, setStats] = useState({ totalSearches: 0, savedRoutes: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setName(displayName);
  }, [displayName]);

  useEffect(() => {
    if (!currentUser) return;
    if (statsLoaded) return;
    let active = true;
    getUserStats().then((data) => {
      if (active) {
        setStats(data);
        setStatsLoaded(true);
      }
    }).catch(() => {
      if (active) setStatsLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [currentUser, getUserStats, statsLoaded]);

  const handleSaveName = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setMessage('');
    try {
      await updateAuthDisplayName(name);
      await updateFirestoreDisplayName(name);
      setMessage('Saved ✓');
      window.setTimeout(() => setMessage(''), 2500);
    } catch (error) {
      setMessage(error.message || 'Could not save name');
    } finally {
      setSaving(false);
    }
  };

  const initial = (displayName || email || 'C').charAt(0).toUpperCase();
  const joined = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'Recently';
  const authMethod = currentUser?.providerData?.some((provider) => provider.providerId === 'google.com') ? 'Google' : 'Email';

  return (
    <main className="min-h-screen bg-cab-bg px-4 py-10">
      <section className="mx-auto max-w-2xl">
        <div className="text-center">
          {photoURL ? (
            <img src={photoURL} alt={displayName} className="mx-auto h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-3xl font-black text-white">
              {initial}
            </div>
          )}
          <h1 className="mt-4 text-2xl font-black text-cab-text">{displayName}</h1>
          <p className="mt-1 text-sm text-cab-muted">{email}</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-cab-border bg-cab-surface p-5 text-center">
            <p className="text-3xl font-black text-cab-blue">{stats.totalSearches}</p>
            <p className="mt-1 text-sm text-cab-muted">Total Searches</p>
          </div>
          <div className="rounded-xl border border-cab-border bg-cab-surface p-5 text-center">
            <p className="text-3xl font-black text-cab-blue">{stats.savedRoutes}</p>
            <p className="mt-1 text-sm text-cab-muted">Saved Routes</p>
          </div>
        </div>

        <form onSubmit={handleSaveName} className="glass-card mt-6 p-5">
          <label className="mb-2 block text-sm font-semibold text-cab-text">Display Name</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input className="input-field" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
            <button
              type="submit"
              disabled={saving}
              style={greenButtonStyle}
              onMouseEnter={applyGreenHover}
              onMouseLeave={resetGreenHover}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
          {message && <p className="mt-3 text-sm text-cab-success">{message}</p>}
        </form>

        <div className="glass-card mt-4 p-5">
          <h2 className="mb-4 font-bold text-cab-text">Account Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-cab-border pb-3"><span className="text-cab-subtle">Email</span><span className="text-cab-muted">{email}</span></div>
            <div className="flex justify-between border-b border-cab-border pb-3"><span className="text-cab-subtle">Joined</span><span className="text-cab-muted">{joined}</span></div>
            <div className="flex justify-between"><span className="text-cab-subtle">Auth method</span><span className="text-cab-muted">{authMethod}</span></div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          style={{ ...destructiveButtonStyle, width: '100%', marginTop: '24px' }}
          onMouseEnter={applyDestructiveHover}
          onMouseLeave={resetDestructiveHover}
        >
          Sign Out
        </button>
      </section>
    </main>
  );
}
