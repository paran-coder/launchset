export function Mark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="3" y="13" width="18" height="13" rx="3" fill="#2B3139" />
      <rect x="7" y="9" width="18" height="13" rx="3" fill="#707A8A" />
      <rect x="11" y="5" width="18" height="13" rx="3" fill="#FCD535" />
      <path d="M20 9h6v6M26 9l-8 8" fill="none" stroke="#181A20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
