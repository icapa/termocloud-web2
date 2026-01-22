
import { useState, useEffect } from 'preact/hooks';
import { databaseService } from '../services/database';
import { calculateHeatingConsumption } from '../utils/consumption';

interface ConsumptionCardProps {
    deviceId: string;
}

export function ConsumptionCard({ deviceId }: ConsumptionCardProps) {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

    // Default to last 7 days including today
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(formattedSevenDaysAgo);
    const [endDate, setEndDate] = useState(formattedToday);
    const [consumptionData, setConsumptionData] = useState<{ date: string; hours: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalHours, setTotalHours] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const events = await databaseService.getEventosRange(deviceId, startDate, endDate);

            // Map raw events to formatted events for calculator
            const formattedEvents = events.map(e => ({
                time: e.time,
                encendido: e.encendido as 0 | 1
            }));

            const result = calculateHeatingConsumption(formattedEvents, startDate, endDate);

            // Convert seconds to hours for display
            const dataInHours = result.map(day => ({
                date: day.date,
                hours: parseFloat((day.seconds / 3600).toFixed(2))
            }));

            setConsumptionData(dataInHours);

            const total = dataInHours.reduce((acc, curr) => acc + curr.hours, 0);
            setTotalHours(parseFloat(total.toFixed(2)));

        } catch (error) {
            console.error('Error calculating consumption:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [deviceId, startDate, endDate]);

    // Calculate max value for graph scaling
    const maxHours = Math.max(...consumptionData.map(d => d.hours), 0.1);

    return (
        <div className="htb-card" style={{ width: '100%', maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    CONSUMO DE CALEFACCIÓN
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>DESDE</span>
                        <div style={{ position: 'relative', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                {startDate.split('-').reverse().join('/')}
                            </div>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e: any) => setStartDate(e.target.value)}
                                onClick={(e: any) => {
                                    try {
                                        if (typeof e.currentTarget.showPicker === 'function') {
                                            e.currentTarget.showPicker();
                                        }
                                    } catch (err) {
                                        // Ignore errors (e.g. if already open)
                                    }
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer',
                                    zIndex: 10
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>HASTA</span>
                        <div style={{ position: 'relative', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                {endDate.split('-').reverse().join('/')}
                            </div>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e: any) => setEndDate(e.target.value)}
                                onClick={(e: any) => {
                                    try {
                                        if (typeof e.currentTarget.showPicker === 'function') {
                                            e.currentTarget.showPicker();
                                        }
                                    } catch (err) {
                                        // Ignore errors
                                    }
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer',
                                    zIndex: 10
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {loading ? (
                    <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
                        <span className="pulse-green">CALCULANDO CONSUMO...</span>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ padding: '0.5rem' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>TOTAL PERIODO</div>
                                <div className="htb-mono" style={{ fontSize: '1.5rem', color: 'var(--accent)', fontWeight: 'bold' }}>
                                    {totalHours} <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>h</span>
                                </div>
                            </div>
                        </div>

                        {/* Bar Chart Visualization */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                            {consumptionData.map(item => (
                                <div key={item.date} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '100px', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                                        {(() => {
                                            const [y, m, d] = item.date.split('-');
                                            const dateObj = new Date(item.date);
                                            const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
                                            const dayLetter = days[dateObj.getDay()];
                                            return `${dayLetter} ${d}/${m}/${y.slice(2)}`;
                                        })()}
                                    </div>
                                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', height: '24px', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${(item.hours / maxHours) * 100}%`,
                                            height: '100%',
                                            background: item.hours > 0 ? 'var(--accent)' : 'transparent',
                                            opacity: 0.7,
                                            transition: 'width 0.5s ease-out'
                                        }} />
                                    </div>
                                    <div className="htb-mono" style={{ width: '50px', fontSize: '0.75rem', textAlign: 'left' }}>
                                        {item.hours}h
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
