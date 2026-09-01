export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="中华恐龙考察队">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="33" />
          <path d="M13 47c10-3 18-10 23-19 4-8 9-14 18-13 9 1 15 9 13 17-2 8-10 12-20 10 4 6 10 10 17 12-12 8-31 10-51-7Z" />
          <circle cx="55" cy="25" r="2.6" />
        </svg>
      </span>
      <span className="brand__words">
        <small>中华</small>
        <strong>恐龙考察队</strong>
      </span>
    </div>
  )
}
