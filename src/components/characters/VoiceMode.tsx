'use client'
import { useState, useEffect } from 'react'

interface VoiceModeProps {
  onTranscript: (text: string) => void
  isActive: boolean
}

export function VoiceMode({ onTranscript, isActive }: VoiceModeProps) {
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    if (!isActive) return
    
    // Fallback to Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      if (transcript) onTranscript(transcript)
    }

    if (isActive) {
      recognition.start()
    }

    return () => {
      recognition.stop()
    }
  }, [isActive, onTranscript])

  if (!isActive) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', background: 'rgba(220,38,38,0.1)',
      borderRadius: 8, marginBottom: 12,
      border: '1px solid rgba(220,38,38,0.2)',
    }}>
      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 12 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 3, borderRadius: 1, background: 'var(--red-card)',
            animation: `eqBar 0.5s ease-in-out ${i * 0.1}s infinite alternate`,
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--red-card)' }}>
        Voice mode · Listening...
      </span>
    </div>
  )
}
