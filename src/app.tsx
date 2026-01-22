import { LoginButton } from './components/LoginButton'
import { DeviceStatusCard } from './components/DeviceStatusCard'
import { DeviceControlCard } from './components/DeviceControlCard'
import { EventLogCard } from './components/EventLogCard'
import { DeviceConfigCard } from './components/DeviceConfigCard'
import './app.css'

import { useState, useEffect } from 'preact/hooks';

export function App() {
  const sampleDeviceId = '00000000bceb13f1';
  const [activeTab, setActiveTab] = useState<'control' | 'historial' | 'config'>('control');
  const [activeDesktopTab, setActiveDesktopTab] = useState<'historial' | 'config'>('historial');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div class="app" style={{ height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
      {/*
      <header style={{ textAlign: 'center', marginBottom: '1.5rem', flexShrink: 0, padding: '1rem 0 0 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          TermoCloud<span style={{ color: 'var(--accent)' }}>_OS</span>
        </h1>
      </header>
      */}

      {isMobile ? (
        // Mobile Layout with Tabs
        <div style={{ width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflow: 'hidden', margin: '0 auto', padding: '0 0.5rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={() => setActiveTab('control')}
              style={{
                flex: 1,
                padding: '0rem',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'control' ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === 'control' ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Control
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'historial' ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === 'historial' ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Historial
            </button>
            <button
              onClick={() => setActiveTab('config')}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'config' ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === 'config' ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Config
            </button>
          </div>

          <main style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', flex: 1, overflowY: 'auto', padding: '0.25rem', paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>
            {activeTab === 'control' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <DeviceStatusCard deviceId={sampleDeviceId} />
                <DeviceControlCard deviceId={sampleDeviceId} />

                {/*<div style={{ marginTop: '0rem', display: 'flex', justifyContent: 'center' }}>*/}
                <LoginButton />
                {/*</div>*/}
              </div>
            ) : activeTab === 'historial' ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '2rem' }}>
                <EventLogCard deviceId={sampleDeviceId} />
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '2rem' }}>
                <DeviceConfigCard deviceId={sampleDeviceId} />
              </div>
            )}
          </main>
        </div>
      ) : (
        // Desktop Layout: 2 Columns
        <main style={{
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          gap: '0.5rem',
          width: '100%',
          maxWidth: '1500px',
          flex: 1,
          overflow: 'hidden',
          paddingBottom: '2rem',
          margin: '0 auto',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', padding: '0.5rem' }}>
            <DeviceStatusCard deviceId={sampleDeviceId} />
            <DeviceControlCard deviceId={sampleDeviceId} />
            <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'center' }}>
              <LoginButton />
            </div>
          </div>
          <div style={{ height: '100%', overflow: 'hidden', padding: '0.5rem', paddingBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
            {/* Desktop Tabs for Right Column */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                onClick={() => setActiveDesktopTab('historial')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeDesktopTab === 'historial' ? '2px solid var(--accent)' : '2px solid transparent',
                  color: activeDesktopTab === 'historial' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: 'bold',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '1.25rem'
                }}
              >
                HISTORIAL
              </button>
              <button
                onClick={() => setActiveDesktopTab('config')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeDesktopTab === 'config' ? '2px solid var(--accent)' : '2px solid transparent',
                  color: activeDesktopTab === 'config' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: 'bold',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '1.25rem'
                }}
              >
                CONFIGURACIÓN
              </button>
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              {activeDesktopTab === 'historial' ? (
                <EventLogCard deviceId={sampleDeviceId} />
              ) : (
                <DeviceConfigCard deviceId={sampleDeviceId} />
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

