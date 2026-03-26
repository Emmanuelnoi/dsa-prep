import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function HomePage() {
  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>DSA Patterns</h1>
      <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
        Master DSA interview templates with annotated Python 3+ code.
      </p>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<div>Category page coming soon</div>} />
          <Route path="/category/:categoryId/template/:templateId" element={<div>Template page coming soon</div>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
