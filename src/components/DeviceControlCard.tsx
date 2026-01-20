import { useDevice } from '../hooks/useDevice';
import { databaseService } from '../services/database';

interface DeviceControlCardProps {
    deviceId: string;
}

export function DeviceControlCard({ deviceId }: DeviceControlCardProps) {
    const { control, loading } = useDevice(deviceId);

    if (loading || !control) return null;

    const currentMode = control.modo;
    const autoTemp = control.automatico?.temperatura || 20;

    const handleModeChange = async (newMode: 'on' | 'off' | 'automatico') => {
        try {
            await databaseService.updateDeviceControl(deviceId, { modo: newMode });
        } catch (err) {
            console.error('Error al cambiar modo:', err);
        }
    };

    const handleTempAdjust = async (delta: number) => {
        try {
            const newTemp = autoTemp + delta;
            await databaseService.updateDeviceControl(deviceId, {
                automatico: { temperatura: newTemp }
            });
        } catch (err) {
            console.error('Error al ajustar temperatura:', err);
        }
    };

    return (
        <div className="htb-card" style={{ width: '350px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
                Control de Sistema
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => handleModeChange('on')}
                    className={`htb-button ${currentMode === 'on' ? '' : 'htb-button-outline'}`}
                    style={{ fontSize: '0.75rem', padding: '0.5rem' }}
                >
                    ON
                </button>
                <button
                    onClick={() => handleModeChange('off')}
                    className={`htb-button ${currentMode === 'off' ? '' : 'htb-button-outline'}`}
                    style={{ fontSize: '0.75rem', padding: '0.5rem' }}
                >
                    OFF
                </button>
                <button
                    onClick={() => handleModeChange('automatico')}
                    className={`htb-button ${currentMode === 'automatico' ? '' : 'htb-button-outline'}`}
                    style={{ fontSize: '0.75rem', padding: '0.5rem' }}
                >
                    AUTO
                </button>
            </div>

            {currentMode === 'automatico' && (
                <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                        AJUSTE TEMPERATURA AUTO
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button
                            onClick={() => handleTempAdjust(-0.5)}
                            className="htb-button htb-button-outline"
                            style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', fontSize: '1.2rem' }}
                        >
                            -
                        </button>

                        <div className="htb-mono" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                            {autoTemp.toFixed(1)}<span style={{ fontSize: '0.875rem' }}>°C</span>
                        </div>

                        <button
                            onClick={() => handleTempAdjust(0.5)}
                            className="htb-button htb-button-outline"
                            style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', fontSize: '1.2rem' }}
                        >
                            +
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
