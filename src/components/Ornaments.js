export function Rule({ children }) {
  return <div className="rule font-head text-[0.7rem] uppercase tracking-[0.3em]"><span aria-hidden="true">✦</span>{children}<span aria-hidden="true">✦</span></div>;
}
export function Star({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} width="20" height="20"><path d="M12 1l2.4 8.6L23 12l-8.6 2.4L12 23l-2.4-8.6L1 12l8.6-2.4z" fill="currentColor" /></svg>
  );
}
