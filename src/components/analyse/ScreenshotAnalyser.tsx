'use client'
import { useState, useRef, useCallback } from 'react'

interface AnalysisResult {
  analysis: string
  formation?: string
  keyObservation?: string
  generatedAt: string
}

export function ScreenshotAnalyser() {
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WebP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }

    setError('')
    setResult(null)
    setImageFile(file)

    const reader = new FileReader()
    reader.onload = e => setImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  async function analyse() {
    if (!imageFile || !image) return
    setLoading(true)
    setError('')

    try {
      // Convert to base64
      const base64 = image.split(',')[1]
      const mimeType = imageFile.type

      const res = await fetch('/api/analyse/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? `API error ${res.status}`)
      }

      const data = await res.json()
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setImage(null)
    setImageFile(null)
    setResult(null)
    setError('')
  }

  return (
    <div>
      {/* Upload zone */}
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--green)' : 'var(--border)'}`,
            borderRadius: 16, padding: '48px 24px',
            textAlign: 'center', cursor: 'pointer',
            background: isDragging ? 'var(--green-tint)' : 'var(--bg-card)',
            transition: 'all 0.2s',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>📸</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 18,
            fontWeight: 700, color: 'var(--text)', marginBottom: 8,
          }}>
            Drop your screenshot here
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
            or click to browse · PNG, JPG, WebP · max 5MB
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--green)', color: '#fff',
            borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600,
          }}>
            Choose screenshot →
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        // Image preview
        <div style={{ marginBottom: 16 }}>
          <div style={{
            borderRadius: 12, overflow: 'hidden',
            border: '1px solid var(--border)', marginBottom: 10,
            maxHeight: 400, display: 'flex', alignItems: 'center',
            background: '#000',
          }}>
            <img
              src={image}
              alt="Match screenshot"
              style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={analyse}
              disabled={loading}
              style={{
                flex: 2, background: loading ? 'var(--bg-elevated)' : 'var(--green)',
                color: loading ? 'var(--text-3)' : '#fff',
                border: 'none', borderRadius: 10, padding: '12px 16px',
                fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'El Maestro is analysing...' : '🔍 Analyse with El Maestro →'}
            </button>
            <button
              onClick={reset}
              style={{
                flex: 1, background: 'var(--bg-elevated)',
                border: '1px solid var(--border)', borderRadius: 10,
                padding: '12px', fontSize: 13, color: 'var(--text-2)',
                cursor: 'pointer',
              }}
            >
              New screenshot
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: '#1e3a5f',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 14, color: 'rgba(255,255,255,0.85)',
            margin: '0 auto 12px',
            animation: 'livePulse 1.5s ease-in-out infinite',
          }}>
            EM
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 4 }}>
            El Maestro is reading the formation...
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            Gemini Vision · tactical analysis · 5–10 seconds
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(220,38,38,0.08)',
          border: '1px solid rgba(220,38,38,0.3)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 16,
          fontSize: 13, color: 'var(--red-card)',
        }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div>
          {/* Formation badge if detected */}
          {result.formation && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--green-tint)', border: '1px solid var(--green)',
              borderRadius: 99, padding: '4px 12px',
              fontSize: 12, fontWeight: 700, color: 'var(--green)',
              marginBottom: 12,
            }}>
              Formation detected: {result.formation}
            </div>
          )}

          {/* El Maestro analysis card */}
          <div style={{
            background: 'color-mix(in srgb, #1e3a5f 4%, var(--bg-card))',
            border: '1px solid var(--border)',
            borderLeft: '3px solid #1e3a5f',
            borderRadius: '0 12px 12px 0',
            padding: 20, marginBottom: 16,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: '#1e3a5f',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 12, color: 'rgba(255,255,255,0.85)',
              }}>EM</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                  El Maestro · Tactical Analysis
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
                  Gemini 2.0 Flash Vision · {new Date(result.generatedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
            <p style={{
              fontSize: 14, color: 'var(--text-2)',
              lineHeight: 1.75, margin: 0,
            }}>
              {result.analysis}
            </p>
            {result.keyObservation && (
              <div style={{
                marginTop: 14, padding: '10px 14px',
                background: 'rgba(30,58,95,0.2)',
                borderRadius: 8,
                fontSize: 13, color: 'var(--text-2)',
                fontStyle: 'italic',
              }}>
                💡 Key observation: {result.keyObservation}
              </div>
            )}
          </div>

          {/* Follow-up CTA */}
          <a href="/characters/el-maestro" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '12px 16px', textDecoration: 'none',
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
              Want to go deeper? Chat with El Maestro about this match.
            </span>
            <span style={{ fontSize: 13, color: 'var(--green)',
              fontWeight: 600, flexShrink: 0, marginLeft: 10 }}>
              Ask El Maestro →
            </span>
          </a>

          <button onClick={reset} style={{
            width: '100%', background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', borderRadius: 10,
            padding: '10px', fontSize: 13, color: 'var(--text-2)',
            cursor: 'pointer',
          }}>
            Analyse another screenshot
          </button>
        </div>
      )}

      {/* How it works */}
      {!image && !result && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 16,
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
          }}>
            How it works
          </p>
          {[
            { icon: '📱', text: 'Screenshot your TV, phone, or tablet during any live match' },
            { icon: '📤', text: 'Upload the screenshot here — drag and drop or tap to browse' },
            { icon: '🔍', text: 'Gemini Vision reads the pitch and identifies formations, positions, pressing patterns' },
            { icon: '🎯', text: 'El Maestro delivers a tactical breakdown in 5–10 seconds' },
          ].map(item => (
            <div key={item.icon} style={{
              display: 'flex', gap: 12, marginBottom: 10,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
