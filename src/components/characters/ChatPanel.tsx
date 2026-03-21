'use client'
import { useChat } from 'ai/react'
import { useEffect, useRef, useState } from 'react'
import { ShareButton } from './ShareButton'
import { SuggestedPrompts } from './SuggestedPrompts'
import type { Character } from '@/types'

interface ChatPanelProps {
  character: Character
}

export function ChatPanel({ character }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: `/api/characters/${character.id}/chat`,
    initialMessages: [{
      id: 'welcome',
      role: 'assistant',
      content: character.welcome,
    }],
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      display: 'flex', flexDirection: 'column',
      height: 580, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--bg-elevated)',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: character.color,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 11, color: 'rgba(255,255,255,0.85)', flexShrink: 0,
        }}>
          {character.monogram}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
            {character.name}
          </div>
          <div style={{ fontSize: 10, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              width: 4, height: 4, borderRadius: '50%',
              background: 'var(--green)', display: 'inline-block',
              animation: 'livePulse 1.5s ease-in-out infinite',
            }} />
            Online
          </div>
        </div>
        <div style={{ flexShrink: 0, minWidth: 140 }}>
          <ShareButton characterId={character.id} />
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 14,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {messages.map(message => (
          <div key={message.id} style={{
            display: 'flex',
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '82%', padding: '10px 14px',
              borderRadius: 10, fontSize: 13, lineHeight: 1.6,
              ...(message.role === 'user' ? {
                background: 'var(--green)', color: '#fff',
                borderBottomRightRadius: 2,
              } : {
                background: 'var(--bg-elevated)', color: 'var(--text)',
                border: '1px solid var(--border)',
                borderBottomLeftRadius: 2,
              }),
            }}>
              {message.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '10px 14px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 10, borderBottomLeftRadius: 2,
              display: 'flex', gap: 4, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: character.color, display: 'inline-block',
                  animation: 'typingBounce 0.8s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Suggested prompts when only welcome message */}
        {messages.length === 1 && (
          <div style={{ marginTop: 8 }}>
            <p style={{
              fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
            }}>
              Try asking
            </p>
            <SuggestedPrompts
              prompts={character.suggested}
              onSelect={(p) => setInput(p)}
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 12px', borderTop: '1px solid var(--border)',
        display: 'flex', gap: 8,
      }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e as any)
            }
          }}
          placeholder={`Ask ${character.name} anything...`}
          style={{
            flex: 1, background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 8, padding: '9px 12px',
            fontSize: 13, color: 'var(--text)', outline: 'none',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = character.color }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
        <button
          onClick={handleSubmit as any}
          disabled={isLoading || !input.trim()}
          style={{
            background: 'var(--green)', color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 16px', fontSize: 13,
            fontWeight: 600, cursor: 'pointer', flexShrink: 0,
            opacity: (isLoading || !input.trim()) ? 0.5 : 1,
          }}
        >
          Send →
        </button>
      </div>

      <div style={{
        padding: '5px 12px', borderTop: '1px solid var(--border)',
        fontSize: 10, color: 'var(--text-3)', textAlign: 'center',
      }}>
        Powered by Groq · responses may vary
      </div>
    </div>
  )
}
