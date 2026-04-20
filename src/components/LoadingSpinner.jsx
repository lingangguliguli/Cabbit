// React concepts: props, conditional rendering, named exports

export default function LoadingSpinner({ fullPage = false, message = 'Loading...' }) {
  const wrapperClass = fullPage
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-cab-bg'
    : 'flex flex-col items-center justify-center py-12';

  return (
    <div className={wrapperClass}>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-cab-border border-t-cab-blue" />
      {message && <p className="mt-4 text-sm font-medium text-cab-muted">{message}</p>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card min-h-[286px] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="skeleton h-9 w-9 rounded-full" />
          <div className="skeleton h-4 w-20" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="skeleton mb-4 h-5 w-24" />
      <div className="skeleton mb-6 h-10 w-32" />
      <div className="border-t border-cab-border pt-4">
        <div className="mb-2 flex justify-between">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-12" />
        </div>
        <div className="mb-2 flex justify-between">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-3 w-10" />
        </div>
        <div className="flex justify-between">
          <div className="skeleton h-3 w-12" />
          <div className="skeleton h-3 w-14" />
        </div>
      </div>
      <div className="skeleton mt-5 h-10 w-full rounded-xl" />
    </div>
  );
}
