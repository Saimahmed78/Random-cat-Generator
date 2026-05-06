import { useEffect, useState } from 'react'


function App() {
  const [cat, setCat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)  // ← was missing

  useEffect(() => {
    const controller = new AbortController()

    // fetch logic lives INSIDE effect — no warning
    const fetchCat = async () => {
      try {
        const response = await fetch('https://api.freeapi.app/api/v1/public/cats/cat/random', { signal: controller.signal })
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
      const data = await response.json()
      setCat(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  // Loading component
  if (loading) return (
    <div style={{ ...styles.app, justifyContent: 'center' }}>
      <div style={styles.spinner} />
      <p style={{ color: '#ccc', marginTop: '1rem', fontSize: '13px' }}>Fetching a cat...</p>
    </div>
  )

  // Error component
  if (error) return (
    <div style={{ ...styles.app, justifyContent: 'center' }}>
      <div style={styles.errorBox}>
        <p style={styles.errorIcon}>🐱💔</p>
        <p style={styles.errorText}>Failed to fetch cat</p>
        <p style={styles.errorSub}>{error}</p>
        <button style={styles.btn} onClick={handleNewCat}>↻ Try again</button>
      </div>
    </div>
  )

  const energy = Math.min(5, cat?.energy_level || 0)

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Random Cat Viewer</h1>
      <p style={styles.subtitle}>Discover a new breed every time</p>
      <button style={styles.btn} onClick={handleNewCat}>↻ Get new cat</button>

      {loading && <p style={{ color: '#999', fontSize: '13px' }}>Loading...</p>}

      {!loading && cat && (
        <div style={styles.card}>
          <div style={styles.imgWrap}>
            <span style={styles.badge}>Featured</span>
            <img src={cat.image} alt={cat.name} style={styles.img} />
          </div>
          <div style={styles.body}>
            <div style={styles.catName}>{cat.name}</div>
            <p style={styles.sectionTitle}>Qualities</p>
            <div style={styles.grid}>
              <div style={styles.stat}><div style={styles.statLabel}>Origin</div><div style={styles.statValue}>{cat.origin}</div></div>
              <div style={styles.stat}><div style={styles.statLabel}>Life span</div><div style={styles.statValue}>{cat.life_span} yrs</div></div>
              <div style={styles.stat}><div style={styles.statLabel}>Temperament</div><div style={styles.statValue}>{cat.temperament}</div></div>
              <div style={styles.stat}><div style={styles.statLabel}>Dog friendly</div><div style={styles.statValue}>{'★'.repeat(Math.min(5, cat.dog_friendly))}{'☆'.repeat(5 - Math.min(5, cat.dog_friendly))}</div></div>
              <div style={styles.barWrap}>
                <div style={styles.barHeader}><span style={styles.statLabel}>Energy level</span><span style={styles.statLabel}>{energy}/5</span></div>
                <div style={styles.barBg}><div style={{ height: '100%', borderRadius: '4px', background: '#378ADD', width: `${(energy / 5) * 100}%`, transition: 'width 0.5s ease' }} /></div>
              </div>
            </div>
            {cat.wikipedia_url && <a href={cat.wikipedia_url} target="_blank" rel="noopener noreferrer" style={styles.wikiLink}>↗ Read on Wikipedia</a>}
          </div>
        </div>
      )}
    </div>
  )
}

export default App

const styles = {
  app: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem', minHeight: '100vh', background: '#52524bff', fontFamily: 'system-ui, sans-serif' },
  title: { fontSize: '22px', fontWeight: 500, marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#888', marginBottom: '1.5rem' },
  btn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff', fontSize: '13px', cursor: 'pointer', marginBottom: '1.5rem' },
  card: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', width: '100%', maxWidth: '480px', overflow: 'hidden' },
  imgWrap: { width: '100%', height: '260px', overflow: 'hidden', position: 'relative', background: '#f0f0f0' },
  img: { width: '100%', height: '100%', objectFit: 'contain', display: 'block' },
  badge: { position: 'absolute', top: '10px', left: '10px', background: '#dbeafe', color: '#1d4ed8', fontSize: '11px', padding: '3px 10px', borderRadius: '8px', fontWeight: 500 },
  body: { padding: '1.25rem' },
  catName: { fontSize: '20px', fontWeight: 500, marginBottom: '4px' },
  sectionTitle: { fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '1rem 0 0.6rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  stat: { background: '#f9f9f7', borderRadius: '8px', padding: '10px 12px' },
  statLabel: { fontSize: '11px', color: '#999', marginBottom: '3px' },
  statValue: { fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  barWrap: { gridColumn: 'span 2', background: '#f9f9f7', borderRadius: '8px', padding: '10px 12px' },
  barHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  barBg: { background: '#e5e5e5', borderRadius: '4px', height: '5px' },
  wikiLink: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1rem', fontSize: '13px', color: '#2563eb', textDecoration: 'none' },
  spinner: {
    width: '32px', height: '32px',
    border: '3px solid #ffffff33',
    borderTop: '3px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  errorBox: {
    background: '#fff', borderRadius: '12px',
    padding: '2rem', textAlign: 'center', maxWidth: '320px'
  },
  errorIcon: { fontSize: '32px', marginBottom: '8px' },
  errorText: { fontSize: '16px', fontWeight: 500, marginBottom: '4px' },
  errorSub: { fontSize: '12px', color: '#999', marginBottom: '1rem' },
}