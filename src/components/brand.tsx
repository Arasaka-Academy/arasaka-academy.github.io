export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 3 43 14v20L24 45 5 34V14L24 3Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="m24 11 12 23h-7l-5-11-5 11h-7l12-23Z" fill="currentColor" />
      <path d="M20 34h8v4h-8z" fill="currentColor" />
    </svg>
  );
}

export function Arrow({ diagonal = false, className = '' }: { diagonal?: boolean; className?: string }) {
  return <svg className={`arrow ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.5" /></svg>;
}
