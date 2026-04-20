// React concepts: Context API, conditional rendering, component composition

import SearchBar from '../components/SearchBar';

const pillStyle = {
  background: '#0d1117',
  border: '1px solid #1e2535',
  borderRadius: '99px',
  padding: '7px 16px',
  color: '#8b949e',
  fontSize: '12px',
  fontWeight: '500',
  fontFamily: 'Inter, sans-serif',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  whiteSpace: 'nowrap',
};

const featureCardStyle = {
  background: '#0d1117',
  border: '1px solid #1e2535',
  borderRadius: '16px',
  padding: '20px 20px',
  transition: 'all 0.25s ease',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-cab-bg">
      <section
        className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center"
        style={{
          paddingBottom: '80px',
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.04) 0%, transparent 60%)',
        }}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cab-blue/[0.15] bg-cab-blue/[0.08] px-4 py-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
          <span className="text-xs font-medium tracking-wide text-blue-300">Live comparison — Uber · Ola · Rapido</span>
        </div>

        <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
          Find the cheapest cab.
          <br />
          <span className="gradient-blue">Instantly.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-cab-muted">
          Compare simulated fares across your favourite ride apps, spot the best deal, and jump straight to booking.
        </p>

        <SearchBar />
        <p
          style={{
            textAlign: 'center',
            color: '#484f58',
            fontSize: '12px',
            marginTop: '10px',
            letterSpacing: '0.01em',
          }}
        >
          Autocomplete unavailable. Try: Koramangala → Whitefield
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '28px',
            marginBottom: '0px',
          }}
        >
          {['⚡ Under 3 seconds', '🔒 No account needed', '₹ Always free'].map((item) => (
            <span key={item} style={pillStyle}>
              {item}
            </span>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            width: '100%',
            maxWidth: '780px',
            margin: '32px auto 0 auto',
            padding: '0 16px',
          }}
        >
          {[
            ['⚡', 'Compare', 'Uber, Ola, and Rapido in one clean list.'],
            ['✓', 'Choose', 'The lowest fare is highlighted automatically.'],
            ['🔖', 'Remember', 'Save routes and revisit your recent searches.'],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              style={featureCardStyle}
              onMouseEnter={(event) => {
                event.currentTarget.style.borderColor = '#22c55e33';
                event.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.borderColor = '#1e2535';
                event.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '22px', marginBottom: '10px' }}>{icon}</div>
              <div
                style={{
                  color: '#f0f6fc',
                  fontWeight: '600',
                  fontSize: '14px',
                  marginBottom: '6px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {title}
              </div>
              <div
                style={{
                  color: '#8b949e',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {text}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20"
        style={{
          textAlign: 'center',
        }}
      >
        <h2 className="text-3xl font-black text-cab-text sm:text-4xl">How Cabbit works</h2>
        <div
          className="mt-12 grid w-full max-w-3xl grid-cols-1 place-items-center gap-8 sm:grid-cols-3"
          style={{
            alignItems: 'center',
            margin: '48px auto 0 auto',
          }}
        >
          {[
            ['1', 'Enter locations'],
            ['2', 'Compare prices'],
            ['3', 'Book the cheapest'],
          ].map(([step, title]) => (
            <div
              key={step}
              className="flex w-full max-w-[220px] flex-col items-center justify-center"
              style={{
                textAlign: 'center',
              }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-cab-blue/20 bg-cab-blue/10 text-sm font-black text-cab-blue">{step}</div>
              <h3 className="font-bold text-cab-text" style={{ textAlign: 'center' }}>{title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-cab-border bg-cab-surface py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 text-center sm:grid-cols-3">
          {[
            ['3', 'Platforms'],
            ['<3s', 'Time'],
            ['₹200+', 'Savings'],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="gradient-blue text-4xl font-black">{value}</div>
              <p className="mt-2 text-sm text-cab-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-cab-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row">
          <p className="text-sm text-cab-muted">🐇 Cabbit © 2025 · Built with React & Firebase</p>
          <p className="text-xs text-cab-subtle">All cab prices are simulated estimates.</p>
        </div>
      </footer>
    </main>
  );
}
