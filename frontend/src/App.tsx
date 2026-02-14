import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { IncidentList } from './pages/IncidentList'
import { IncidentDetail } from './pages/IncidentDetail'
import { IncidentCreate } from './pages/IncidentCreate'
import styles from './App.module.css'

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <header className={styles.header}>
          <Link to="/" className={styles.logo}>Incident Tracker</Link>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Incidents</Link>
            <Link to="/incidents/new" className={styles.navLink}>New Incident</Link>
          </nav>
        </header>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<IncidentList />} />
            <Route path="/incidents/new" element={<IncidentCreate />} />
            <Route path="/incidents/:id" element={<IncidentDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
