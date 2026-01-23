import { useDevice } from '../hooks/useDevice';
import { useState, useEffect } from 'preact/hooks';
import { fetchWeather } from '../services/weatherService';

interface DeviceStatusCardProps {
    deviceId: string;
}

const getWeatherIcon = (code: number) => {
    // WMO Weather interpretation codes (WW)
    // 0: Clear sky
    if (code === 0) return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#fbbf24' }}>
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    );
    // 1-3: Mainly clear, partly cloudy, and overcast
    if (code >= 1 && code <= 3) return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#94a3b8' }}>
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </svg>
    );
    // 45, 48: Fog
    if (code === 45 || code === 48) return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#94a3b8' }}>
            <line x1="4" y1="15" x2="12" y2="15"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
        </svg>
    );
    // 51-67: Drizzle and Rain
    if (code >= 51 && code <= 67) return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#60a5fa' }}>
            <line x1="16" y1="13" x2="16" y2="21"></line>
            <line x1="8" y1="13" x2="8" y2="21"></line>
            <line x1="12" y1="15" x2="12" y2="23"></line>
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
        </svg>
    );
    // 80-82: Showers
    if (code >= 80 && code <= 82) return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#60a5fa' }}>
            <line x1="16" y1="13" x2="16" y2="21"></line>
            <line x1="8" y1="13" x2="8" y2="21"></line>
            <line x1="12" y1="15" x2="12" y2="23"></line>
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
        </svg>
    );

    // 71-77, 85-86: Snow
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#e2e8f0' }}>
            <line x1="8" y1="19" x2="8" y2="21"></line>
            <line x1="8" y1="13" x2="8" y2="15"></line>
            <line x1="16" y1="19" x2="16" y2="21"></line>
            <line x1="16" y1="13" x2="16" y2="15"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="12" y1="15" x2="12" y2="17"></line>
            <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
        </svg>
    );
    // 95-99: Thunderstorm
    if (code >= 95) return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#f59e0b' }}>
            <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path>
            <polyline points="13 11 9 17 15 17 11 23"></polyline>
        </svg>
    );

    return null;
}

export function DeviceStatusCard({ deviceId }: DeviceStatusCardProps) {
    const { estado, control, loading, error } = useDevice(deviceId);
    const [outdoorTemp, setOutdoorTemp] = useState<number | null>(null);
    const [weatherCode, setWeatherCode] = useState<number | null>(null);
    const [sunTimes, setSunTimes] = useState<{ sunrise: string; sunset: string } | null>(null);

    useEffect(() => {
        const loadWeather = async () => {
            // Parbayón coordinates
            const data = await fetchWeather(43.3548, -3.8653);
            if (data) {
                setOutdoorTemp(data.temperature);
                setWeatherCode(data.weatherCode);
                setSunTimes({ sunrise: data.sunrise, sunset: data.sunset });
            }
        };
        loadWeather();
        // Refresh every 30 mins
        const interval = setInterval(loadWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="htb-card" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <div style={{ color: 'var(--text-secondary)' }}>
                    <span className="pulse-green">CARGANDO SISTEMA...</span>
                </div>
            </div>
        );
    }
    // ... error and missing device states ...

    if (error) {
        return (
            <div className="htb-card" style={{ borderLeft: '4px solid var(--error)', width: '100%' }}>
                <div style={{ color: 'var(--error)', fontWeight: 'bold' }}>ERROR DE CONEXIÓN</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</div>
            </div>
        );
    }

    if (!estado || !control) {
        return (
            <div className="htb-card" style={{ borderLeft: '4px solid var(--text-secondary)', width: '100%' }}>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>DISPOSITIVO NO ENCONTRADO</div>
            </div>
        );
    }

    const isOnline = estado.encendido === 1;

    return (
        <div className="htb-card" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', padding: '0.25rem 0' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0rem' }}>ACTUAL</div>
                    <div className="htb-mono" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{estado.temperatura}<span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>°C</span></div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0rem' }}>OBJETIVO</div>
                    <div className="htb-mono" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)' }}>{estado.temperaturaObjetivo}<span style={{ fontSize: '0.75rem' }}>°C</span></div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)', gridColumn: 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0rem' }}>EXTERIOR (PARBAYÓN)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                        <div className="htb-mono" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {outdoorTemp !== null ? outdoorTemp : '--'}
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>°C</span>
                        </div>
                        {weatherCode !== null && getWeatherIcon(weatherCode)}
                    </div>
                    {sunTimes && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#fbbf24' }}>
                                    <path d="M17 18a5 5 0 0 0-10 0"></path>
                                    <line x1="12" y1="2" x2="12" y2="9"></line>
                                    <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                                    <line x1="1" y1="18" x2="3" y2="18"></line>
                                    <line x1="21" y1="18" x2="23" y2="18"></line>
                                    <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
                                    <line x1="23" y1="22" x2="1" y2="22"></line>
                                    <polyline points="8 6 12 2 16 6"></polyline>
                                </svg>
                                <span className="htb-mono">{new Date(sunTimes.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#9ca3af' }}>
                                    <path d="M17 18a5 5 0 0 0-10 0"></path>
                                    <line x1="12" y1="9" x2="12" y2="2"></line>
                                    <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                                    <line x1="1" y1="18" x2="3" y2="18"></line>
                                    <line x1="21" y1="18" x2="23" y2="18"></line>
                                    <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
                                    <line x1="23" y1="22" x2="1" y2="22"></line>
                                    <polyline points="16 5 12 9 8 5"></polyline>
                                </svg>
                                <span className="htb-mono">{new Date(sunTimes.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <span>MODO ACTUAL</span>
                    <span className="htb-mono" style={{ color: 'var(--text-primary)' }}>{control.modo.toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>ÚLTIMA SYNC</span>
                    <span className="htb-mono" style={{ color: 'var(--text-primary)' }}>{new Date(estado.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </div >
    );
}
