import { useState, useEffect } from 'preact/hooks';
import { databaseService } from '../services/database';
import type { EventoEntry } from '../types/database';

interface EventLogCardProps {
    deviceId: string;
}

export function EventLogCard({ deviceId }: EventLogCardProps) {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [viewMode, setViewMode] = useState<'eventos' | 'registros'>('eventos');
    const [events, setEvents] = useState<Record<string, EventoEntry> | null>(null);
    const [registros, setRegistros] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        let unsubscribe: () => void;

        if (viewMode === 'eventos') {
            unsubscribe = databaseService.onEventosByDateChange(deviceId, selectedDate, (data) => {
                setEvents(data);
                setLoading(false);
            });
        } else {
            unsubscribe = databaseService.onRegistrosByDateChange(deviceId, selectedDate, (data) => {
                setRegistros(data);
                setLoading(false);
            });
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [deviceId, selectedDate, viewMode]);

    const handleDateChange = (e: any) => {
        setSelectedDate(e.target.value);
    };

    const dataList = viewMode === 'eventos'
        ? (events ? Object.entries(events).sort((a, b) => b[0].localeCompare(a[0])) : [])
        : (registros ? Object.entries(registros).sort((a, b) => b[0].localeCompare(a[0])) : []);

    return (
        <div className="htb-card" style={{ width: '100%', maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem', flexShrink: 0 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {viewMode === 'eventos' ? (
                            <>
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </>
                        ) : (
                            <>
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </>
                        )}
                    </svg>
                    {viewMode === 'eventos' ? 'HISTORIAL DE EVENTOS' : 'REGISTROS DE TEMPERATURA'}
                </h3>
                <div style={{ display: 'flex', gap: '0rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border)', padding: '0px' }}>
                        <button
                            onClick={() => setViewMode('eventos')}
                            style={{
                                background: viewMode === 'eventos' ? 'var(--accent)' : 'transparent',
                                color: viewMode === 'eventos' ? 'var(--bg-main)' : 'var(--text-secondary)',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            EVENTOS
                        </button>
                        <button
                            onClick={() => setViewMode('registros')}
                            style={{
                                background: viewMode === 'registros' ? 'var(--accent)' : 'transparent',
                                color: viewMode === 'registros' ? 'var(--bg-main)' : 'var(--text-secondary)',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            REGISTROS
                        </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            aria-label="Seleccionar fecha"
                            style={{
                                background: 'var(--bg-main)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-primary)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '4px',
                                fontFamily: 'inherit',
                                fontSize: '0.875rem',
                                outline: 'none',
                                cursor: 'pointer',
                                height: '30px'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-card)', zIndex: 1 }}>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: '500' }}>HORA</th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: '500' }}>ESTADO</th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: '500' }}>TEMP</th>
                        </tr>
                    </thead>
                    <tbody className="htb-mono">
                        {loading ? (
                            <tr>
                                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <span className="pulse-green">CARGANDO DATOS...</span>
                                </td>
                            </tr>
                        ) : dataList.length > 0 ? (
                            dataList.map(([time, item]) => (
                                <tr key={time} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '0.1rem 0.5rem', color: 'var(--text-secondary)' }}>{time}</td>
                                    <td style={{ padding: '0.1rem 0.5rem' }}>
                                        <span style={{
                                            color: item.encendido === 1 ? 'var(--accent)' : 'var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                backgroundColor: item.encendido === 1 ? 'var(--accent)' : (item.encendido === -1 ? 'var(--error)' : 'var(--text-secondary)')
                                            }} />
                                            {viewMode === 'eventos'
                                                ? `${item.encendido === 1 ? 'ON' : 'OFF'}/${(item.modo === 'automatico' ? 'AUTO' : item.modo || '').toUpperCase()}`
                                                : (item.encendido === 1 ? 'ON' : (item.encendido === -1 ? 'ERR' : 'OFF'))
                                            }
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.2rem 0.5rem' }}>
                                        {item.temperatura}<span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>°C</span>
                                        <span style={{ color: 'var(--text-secondary)', margin: '0 0.25rem' }}>/</span>
                                        <span style={{ color: 'var(--accent)' }}>{item.temperaturaObjetivo}</span><span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>°C</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    NO HAY DATOS PARA ESTA FECHA
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
