'use client'

interface SuggestedPromptsProps {
  prompts: string[]
  onSelect?: (prompt: string) => void
}

export function SuggestedPrompts({ prompts, onSelect }: SuggestedPromptsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {prompts.map(prompt => (
        <button
          key={prompt}
          onClick={() => onSelect?.(prompt)}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 10px',
            fontSize: 12, color: 'var(--text-2)',
            cursor: 'pointer', textAlign: 'left',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--border-hover)'
            el.style.color = 'var(--text)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--border)'
            el.style.color = 'var(--text-2)'
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
