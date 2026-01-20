import { LoginButton } from './components/LoginButton'
import { DeviceStatusCard } from './components/DeviceStatusCard'
import { DeviceControlCard } from './components/DeviceControlCard'
import './app.css'

export function App() {
  const sampleDeviceId = '00000000bceb13f1';

  return (
    <div class="app">
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          TermoCloud<span style={{ color: 'var(--accent)' }}>_OS</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          CONECTADO AL SISTEMA DE CONTROL TÉRMICO
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        <DeviceStatusCard deviceId={sampleDeviceId} />
        <DeviceControlCard deviceId={sampleDeviceId} />
      </main>

      <footer style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <LoginButton />
      </footer>
    </div>
  )
}

