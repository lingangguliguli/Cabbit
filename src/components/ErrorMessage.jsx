// React concepts: props, conditional rendering, event handling

export default function ErrorMessage({ message, onRetry, onUseDemoData }) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
      <div className="mb-3 text-4xl">⚠️</div>
      <h2 className="mb-2 text-lg font-bold text-cab-text">Something went wrong</h2>
      <p className="mb-5 text-sm leading-relaxed text-red-300">{message || 'Please try again.'}</p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-cab-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cab-blue-light"
          >
            Try Again
          </button>
        )}
        {onUseDemoData && (
          <button
            type="button"
            onClick={onUseDemoData}
            className="rounded-xl border border-cab-border bg-cab-elevated px-5 py-2.5 text-sm font-semibold text-cab-muted transition-colors hover:border-cab-blue hover:text-cab-text"
          >
            Use Demo Data
          </button>
        )}
      </div>
    </div>
  );
}
