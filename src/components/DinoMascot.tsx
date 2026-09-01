export function DinoMascot({ className = '' }: { className?: string }) {
  return (
    <svg className={`dino-mascot ${className}`} viewBox="0 0 640 560" role="img" aria-label="戴着考察帽的小恐龙豆包">
      <defs>
        <linearGradient id="dinoBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4caf7d" />
          <stop offset="1" stopColor="#26745a" />
        </linearGradient>
        <linearGradient id="belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9eaa9" />
          <stop offset="1" stopColor="#b9d27d" />
        </linearGradient>
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#173c34" floodOpacity=".2" />
        </filter>
      </defs>

      <ellipse cx="324" cy="498" rx="230" ry="31" fill="#173c34" opacity=".13" />
      <g className="mascot-tail" filter="url(#softShadow)">
        <path d="M256 325C170 295 87 324 43 395c64-39 129-28 205 36Z" fill="url(#dinoBody)" />
        <path d="M89 365c40-27 91-24 137 3" fill="none" stroke="#65bd8f" strokeWidth="12" strokeLinecap="round" opacity=".7" />
      </g>

      <g filter="url(#softShadow)">
        <path d="M255 231c-48 42-68 115-45 184 20 59 77 88 143 73 60-13 96-64 87-128-7-54-39-112-86-137-33-17-72-13-99 8Z" fill="url(#dinoBody)" />
        <path d="M283 283c-31 40-33 114-6 158 22 35 69 34 93 2 31-41 27-124-13-162-22-21-54-20-74 2Z" fill="url(#belly)" opacity=".95" />
        <path d="M248 412c-9 29-7 62 8 83 13 19 50 16 56-8 7-27 2-60-7-82Z" fill="#266e57" />
        <path d="M368 407c-3 28 3 64 22 82 16 15 51 4 52-19 0-29-11-56-27-75Z" fill="#266e57" />
        <path d="M245 487c-10 10-12 24-2 32 13 10 64 8 76-3 7-7 3-19-7-28Z" fill="#173f37" />
        <path d="M384 481c-9 12-7 26 5 32 15 7 59-2 68-14 6-8-1-19-13-24Z" fill="#173f37" />
      </g>

      <g className="mascot-head" filter="url(#softShadow)">
        <path d="M262 102c-53 22-74 84-48 137 24 50 79 69 139 54 74-18 131-74 116-132-14-53-78-72-135-66-27 3-50 2-72 7Z" fill="url(#dinoBody)" />
        <path d="M370 195c26-21 76-18 95 6-4 35-44 62-82 62-29 0-41-40-13-68Z" fill="#3e9a70" />
        <ellipse cx="379" cy="153" rx="17" ry="20" fill="#173f37" />
        <circle cx="385" cy="146" r="6" fill="white" />
        <ellipse cx="447" cy="207" rx="5" ry="4" fill="#173f37" opacity=".75" />
        <path d="M423 232c13 5 26 4 38-4" fill="none" stroke="#173f37" strokeWidth="8" strokeLinecap="round" />
        <circle cx="403" cy="218" r="14" fill="#ed8265" opacity=".35" />
        <path d="M235 139l-43-34 61 6m22-32-17-56 51 48m21 6 12-54 28 66" fill="#ec805f" stroke="#173f37" strokeWidth="7" strokeLinejoin="round" />
      </g>

      <g className="mascot-hat" filter="url(#softShadow)">
        <path d="M239 110c14-60 80-85 135-55 24 13 39 35 41 61-54 18-118 17-176-6Z" fill="#f1bd4f" />
        <path d="M211 110c63 21 142 28 222 5 16-5 28 14 14 24-36 24-167 20-231-5-16-6-19-20-5-24Z" fill="#d99a32" />
        <path d="M280 61c31-17 70-11 91 14" fill="none" stroke="#ffe38c" strokeWidth="10" strokeLinecap="round" />
      </g>

      <g className="mascot-backpack">
        <path d="M204 276c-28 12-42 43-35 77l18 86c5 24 28 37 51 29l22-8-35-190Z" fill="#e66f50" />
        <path d="M190 325l54-14M199 374l54-14" stroke="#a64837" strokeWidth="8" />
        <path d="M229 273c21 27 24 68 19 111" fill="none" stroke="#723b32" strokeWidth="12" strokeLinecap="round" />
      </g>

      <g className="mascot-arm">
        <path d="M403 296c38 14 61 46 75 78" fill="none" stroke="#2d805f" strokeWidth="30" strokeLinecap="round" />
        <circle cx="487" cy="385" r="19" fill="#3c976c" />
        <circle cx="503" cy="399" r="46" fill="none" stroke="#283e49" strokeWidth="12" />
        <path d="M535 432l38 47" stroke="#283e49" strokeWidth="14" strokeLinecap="round" />
        <circle cx="503" cy="399" r="34" fill="#b9e7f2" opacity=".32" />
      </g>

      <g opacity=".75" fill="#d8ebaa">
        <circle cx="252" cy="198" r="10" /><circle cx="278" cy="177" r="7" />
        <circle cx="226" cy="351" r="9" /><circle cx="424" cy="342" r="8" />
      </g>
    </svg>
  )
}
