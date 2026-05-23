import { useEffect, useState } from 'react'
import './index.css'

function App() {
  const [cat, setCat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchCat = async () => {
      try {
        const response = await fetch('https://api.freeapi.app/api/v1/public/cats/cat/random', { signal: controller.signal })
        if (!response.ok) throw new Error('Failed to fetch from API')
        const data = await response.json()
        setCat(data.data)
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCat()
    return () => controller.abort()
  }, [])

  const handleNewCat = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://api.freeapi.app/api/v1/public/cats/cat/random')
      if (!response.ok) throw new Error('Failed to fetch from API')
      const data = await response.json()
      setCat(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Loading component using the custom animation
  if (loading) return (
    <div style={styles.appContainer}>
      <div className="loader-container">
        <div className="cart-wrapper">
          <span className="cart-icon">🛒</span>
          <span className="cat-emoji">🐈</span>
        </div>
        <p className="loading-text">Fetching a cat...</p>
      </div>
    </div>
  )

  // Error component
  if (error) return (
    <div style={styles.appContainer}>
      <div className="glass-panel animate-in" style={styles.errorBox}>
        <p className="error-icon">🐱💔</p>
        <p style={styles.errorText}>Oops! Failed to fetch cat</p>
        <p style={styles.errorSub}>{error}</p>
        <button className="btn-primary" onClick={handleNewCat}>↻ Try again</button>
      </div>
    </div>
  )

  const energy = Math.min(5, cat?.energy_level || 0)

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>
          Cat Listing <span style={styles.titleHighlight}>Shop</span>
        </h1>
        <p style={styles.subtitle}>Discover a premium breed every time</p>
        <button className="btn-primary" onClick={handleNewCat}>
          ✨ Fetch New Cat
        </button>
      </header>

      {cat && (
        <div className="glass-panel animate-in" style={styles.card}>
          <div style={styles.imgWrap}>
            <span style={styles.badge}>Featured</span>
            <div style={{...styles.imgOverlay, backgroundImage: `url(${cat.image})`}} />
            <img src={cat.image} alt={cat.name} style={styles.img} />
          </div>
          <div style={styles.body}>
            <div style={styles.catNameHeader}>
              <h2 style={styles.catName}>{cat.name}</h2>
              {cat.wikipedia_url && (
                <a href={cat.wikipedia_url} target="_blank" rel="noopener noreferrer" style={styles.wikiLink} title="Read on Wikipedia">
                  ↗ Wiki
                </a>
              )}
            </div>
            
            <p style={styles.sectionTitle}>Key Qualities</p>
            <div style={styles.grid}>
              <div style={styles.statPill}>
                <span style={styles.statLabel}>Origin</span>
                <span style={styles.statValue}>{cat.origin || 'Unknown'}</span>
              </div>
              <div style={styles.statPill}>
                <span style={styles.statLabel}>Life Span</span>
                <span style={styles.statValue}>{cat.life_span ? `${cat.life_span} yrs` : 'Unknown'}</span>
              </div>
              <div style={{...styles.statPill, gridColumn: 'span 2'}}>
                <span style={styles.statLabel}>Temperament</span>
                <span style={styles.statValue}>{cat.temperament || 'Unknown'}</span>
              </div>
            </div>

            <div style={styles.barsContainer}>
              <div style={styles.barWrap}>
                <div style={styles.barHeader}>
                  <span style={styles.statLabel}>Dog Friendly</span>
                  <span style={styles.statLabel}>{cat.dog_friendly || 0}/5</span>
                </div>
                <div style={styles.barBg}>
                  <div style={{ ...styles.barFill, width: `${((cat.dog_friendly || 0) / 5) * 100}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                </div>
              </div>

              <div style={styles.barWrap}>
                <div style={styles.barHeader}>
                  <span style={styles.statLabel}>Energy Level</span>
                  <span style={styles.statLabel}>{energy}/5</span>
                </div>
                <div style={styles.barBg}>
                  <div style={{ ...styles.barFill, width: `${(energy / 5) * 100}%`, background: 'var(--accent-gradient)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '3rem 1.5rem',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },
  title: {
    fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#fff',
    margin: 0
  },
  titleHighlight: {
    background: 'var(--accent-gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--text-secondary)',
    marginBottom: '1rem',
    fontWeight: 400
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    overflow: 'hidden',
    padding: '16px', // inner padding to give floating effect to image
  },
  imgWrap: {
    width: '100%',
    height: '320px',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
  },
  imgOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(25px) brightness(0.5)',
    transform: 'scale(1.2)',
    zIndex: 0
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    position: 'relative',
    zIndex: 1,
    filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))'
  },
  badge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    fontSize: '12px',
    padding: '6px 14px',
    borderRadius: '20px',
    fontWeight: 600,
    zIndex: 2,
    border: '1px solid rgba(255,255,255,0.1)'
  },
  body: {
    padding: '1.5rem 0.5rem 0.5rem',
  },
  catNameHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  catName: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  wikiLink: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.1)',
    transition: 'all 0.2s',
  },
  sectionTitle: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontWeight: 600,
    margin: '2rem 0 1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '1.5rem'
  },
  statPill: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--card-border)',
    borderRadius: '16px',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: 500
  },
  statValue: {
    fontSize: '15px',
    color: '#fff',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  barsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--card-border)',
    borderRadius: '16px',
    padding: '16px',
  },
  barWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  barHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  barBg: {
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '8px',
    height: '10px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
  },
  barFill: {
    height: '100%',
    borderRadius: '8px',
    transition: 'width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
  },
  errorBox: {
    padding: '3rem 2rem',
    textAlign: 'center',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  errorText: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 8px'
  },
  errorSub: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    margin: '0 0 24px'
  }
}