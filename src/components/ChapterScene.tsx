import type { Chapter } from '../types/game'

export function ChapterScene({ chapter }: { chapter: Chapter }) {
  return (
    <svg className={`chapter-scene chapter-scene--${chapter.illustration}`} viewBox="0 0 420 180" aria-hidden="true">
      <circle cx="336" cy="40" r="28" fill="#f5c64f" opacity=".92" />
      <path d="M0 133c54-29 98-30 150-3 58 31 108 23 155-6 45-27 82-15 115 5v51H0Z" fill={chapter.paleColor} />
      {chapter.illustration === 'mountain' && (
        <>
          <path d="M4 153 82 56l71 97Zm86 0 86-116 97 116Z" fill="#b95c45" />
          <path d="m140 153 92-89 92 89Z" fill="#d77c58" />
          <path d="m150 72 26-35 29 39-25-9Z" fill="#f8e6d4" />
          <path d="M245 148c35-31 75-34 117-11l58 32v11H220Z" fill="#7ba166" />
          <path d="M316 113c-6 15-9 33-7 52m-12-33 12 10 14-16" fill="none" stroke="#315f48" strokeWidth="7" strokeLinecap="round" />
        </>
      )}
      {chapter.illustration === 'river' && (
        <>
          <path d="m0 135 86-74 72 75 71-92 95 99 46-50 50 45v42H0Z" fill="#568270" />
          <path d="M0 154c80-25 141 28 220 4 75-23 121-14 200 5v17H0Z" fill="#74b8c2" />
          <path d="M113 116c54-30 108-28 162 2" fill="none" stroke="#e5c28a" strokeWidth="13" strokeLinecap="round" />
          <path d="M135 111v34m118-34v37" stroke="#8f694d" strokeWidth="7" />
          <path d="M323 92v59m-17-41 17 13 18-22" fill="none" stroke="#315f48" strokeWidth="8" strokeLinecap="round" />
        </>
      )}
      {chapter.illustration === 'forest' && (
        <>
          <path d="M0 138c54-34 102-32 151-5 49 26 96 26 139-7 44-33 87-30 130 10v44H0Z" fill="#7396a9" />
          {[36, 92, 300, 362].map((x, index) => (
            <g key={x} transform={`translate(${x} ${index % 2 ? 7 : 0})`}>
              <path d="M0 154V75" stroke="#665040" strokeWidth="9" />
              <path d="m0 49-34 68h68Zm0-25-27 61h54Z" fill={index > 1 ? '#365e64' : '#426f67'} />
            </g>
          ))}
          <path d="M0 162c77-22 119 15 185 8 70-8 140-30 235-4v14H0Z" fill="#a4b8a5" />
          <path d="M206 107c10-9 27-7 33 5 5 11-3 24-18 25-14 0-25-9-23-19 1-4 4-8 8-11Z" fill="#2f775e" />
          <circle cx="230" cy="112" r="2" fill="#173f37" />
          <path d="m200 122-24 12m36 1-4 17m17-18 10 15" stroke="#2f775e" strokeWidth="7" strokeLinecap="round" />
        </>
      )}
      <g transform="translate(36 143)" fill="#7e624c">
        <ellipse cx="0" cy="0" rx="11" ry="6" transform="rotate(-20)" />
        <ellipse cx="28" cy="-10" rx="11" ry="6" transform="rotate(12)" />
        <ellipse cx="58" cy="-5" rx="11" ry="6" transform="rotate(-16)" />
      </g>
    </svg>
  )
}
