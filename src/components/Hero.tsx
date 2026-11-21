interface HeroProps {
  totalParticipants: number
}

export function Hero({ totalParticipants }: HeroProps) {
  return (
    <header className="hero">
      <div className="hero-emblem" aria-hidden="true">
        <svg
          width="96"
          height="96"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="emblem-svg"
        >
          {/* Subtle Outer Compass Points */}
          <polygon points="50,2 53,10 50,8 47,10" fill="#E5B338" />
          <polygon points="50,98 53,90 50,92 47,90" fill="#E5B338" />
          <polygon points="2,50 10,53 8,50 10,47" fill="#E5B338" />
          <polygon points="98,50 90,53 92,50 90,47" fill="#E5B338" />

          {/* Double Gold Ring */}
          <circle cx="50" cy="50" r="44" stroke="#E5B338" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="40" stroke="rgba(229, 179, 56, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
          
          {/* Inner Navy Disc */}
          <circle cx="50" cy="50" r="38" fill="url(#disc-gradient)" />

          {/* Anchor Top Shackle */}
          <circle cx="50" cy="22" r="7" stroke="#F7D774" strokeWidth="3" fill="none" />
          {/* Crossbar Stock */}
          <path d="M 32 35 L 68 35" stroke="#F7D774" strokeWidth="4" strokeLinecap="round" />
          <circle cx="32" cy="35" r="2.5" fill="#E5B338" />
          <circle cx="68" cy="35" r="2.5" fill="#E5B338" />

          {/* Anchor Shank */}
          <line x1="50" y1="22" x2="50" y2="76" stroke="#F7D774" strokeWidth="4.5" />

          {/* Anchor Flukes Arc */}
          <path
            d="M 22 56 C 24 76, 76 76, 78 56"
            stroke="#F7D774"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Sharp Fluke Tips */}
          <polygon points="22,56 16,51 23,64" fill="#E5B338" />
          <polygon points="78,56 84,51 77,64" fill="#E5B338" />

          <defs>
            <radialGradient id="disc-gradient" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#173560" />
              <stop offset="100%" stopColor="#0A1424" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="hero-title-group">
        <span className="hero-kicker">CITE DAY 2026 // OFFICIAL DIVISION</span>
        <h1 className="hero-title">
          <span className="hero-title-gradient">TEAM MARINES</span>
        </h1>
        <p className="hero-subtitle">ABSOLUTE COMBAT ROSTER</p>
      </div>

      <div className="hero-banner">
        <span className="banner-star" aria-hidden="true">&#9733;</span>
        <span className="banner-text">JUSTICE</span>
        <span className="banner-star" aria-hidden="true">&#9733;</span>
      </div>

      <div>
        <div className="hero-stats-pill">
          <span className="status-dot" aria-hidden="true"></span>
          <span className="hero-count">
            {totalParticipants === 0 ? (
              'Roster Deployment Pending'
            ) : (
              <>
                <span className="hero-count-number">{totalParticipants}</span> Marines Deployed Across 21 Operations
              </>
            )}
          </span>
        </div>
      </div>
    </header>
  )
}
