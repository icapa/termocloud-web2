import { useDevice } from '../hooks/useDevice';

interface DeviceStatusCardProps {
    deviceId: string;
}

export function DeviceStatusCard({ deviceId }: DeviceStatusCardProps) {
    const { estado, control, loading, error } = useDevice(deviceId);

    if (loading) {
        return (
            <div className="htb-card" style={{ width: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <div style={{ color: 'var(--text-secondary)' }}>
                    <span className="pulse-green">CARGANDO SISTEMA...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="htb-card" style={{ borderLeft: '4px solid var(--error)', width: '350px' }}>
                <div style={{ color: 'var(--error)', fontWeight: 'bold' }}>ERROR DE CONEXIÓN</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</div>
            </div>
        );
    }

    if (!estado || !control) {
        return (
            <div className="htb-card" style={{ borderLeft: '4px solid var(--text-secondary)', width: '350px' }}>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>DISPOSITIVO NO ENCONTRADO</div>
            </div>
        );
    }

    const isOnline = estado.encendido === 1;

    return (
        <div className="htb-card" style={{ width: '350px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', padding: '1rem 0' }}>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Status glow effect */}
                    {isOnline && (
                        <div className="pulse-green" style={{
                            position: 'absolute',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent)',
                            filter: 'blur(15px)',
                            opacity: 0.3,
                            zIndex: 0
                        }} />
                    )}

                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={isOnline ? "var(--accent)" : "var(--text-secondary)"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ zIndex: 1, transition: 'all 0.3s ease' }}
                    >
                        <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" />
                        <line x1="12" y1="2" x2="12" y2="12" />
                    </svg>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>ACTUAL</div>
                    <div className="htb-mono" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{estado.temperatura}<span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>°C</span></div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>OBJETIVO</div>
                    <div className="htb-mono" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>{estado.temperaturaObjetivo}<span style={{ fontSize: '0.875rem' }}>°C</span></div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <span>MODO ACTUAL</span>
                    <span className="htb-mono" style={{ color: 'var(--text-primary)' }}>{control.modo.toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>ÚLTIMA SYNC</span>
                    <span className="htb-mono" style={{ color: 'var(--text-primary)' }}>{new Date(estado.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </div>
    );
}
