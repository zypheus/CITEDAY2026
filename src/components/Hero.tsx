interface HeroProps {
  totalParticipants: number
}

export function Hero({ totalParticipants }: HeroProps) {
  return (
    <header className="hero">
      <div className="hero-emblem" aria-hidden="true">
        <svg
          width="88"
          height="88"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="emblem-svg"
        >
          {/* Outer ring */}
          <circle cx="50" cy="50" r="44" stroke="#E0B040" strokeWidth="4" />
          <circle cx="50" cy="50" r="40" stroke="#1E4D8C" strokeWidth="2" strokeDasharray="3 3" />
          
          {/* Anchor top ring */}
          <circle cx="50" cy="22" r="8" stroke="#E0B040" strokeWidth="3" />
          {/* Anchor stock crossbar */}
          <line x1="30" y1="36" x2="70" y2="36" stroke="#E0B040" strokeWidth="4" strokeLinecap="square" />
          <circle cx="30" cy="36" r="3" fill="#E0B040" />
          <circle cx="70" cy="36" r="3" fill="#E0B040" />
          
          {/* Anchor shank */}
          <line x1="50" y1="22" x2="50" y2="76" stroke="#E0B040" strokeWidth="5" />
          
          {/* Anchor fluke arc */}
          <path
            d="M 22 58 C 24 78, 76 78, 78 58"
            stroke="#E0B040"
            strokeWidth="4"
            strokeLinecap="square"
            fill="none"
          />
          {/* Anchor tips */}
          <polygon points="22,58 16,54 22,66" fill="#E0B040" />
          <polygon points="78,58 84,54 78,66" fill="#E0B040" />
        </svg>
      </div>

      <h1 className="hero-title">CITE DAY 2026</h1>
      <p className="hero-subtitle">TEAM MARINES</p>

      <div className="hero-banner">
        <span className="banner-text">JUSTICE</span>
      </div>

      <p className="hero-count">
        {totalParticipants === 0
          ? 'Roster awaiting deployment'
          : `${totalParticipants} Marines enlisted across all operations`}
      </p>
    </header>
  )
}
