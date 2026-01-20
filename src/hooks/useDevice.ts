import { useState, useEffect } from 'preact/hooks';
import { databaseService } from '../services/database';
import type { DeviceEstado, DeviceControl } from '../types/database';

/**
 * Custom hook to sync device state and control in real-time
 */
export function useDevice(deviceId: string) {
    const [estado, setEstado] = useState<DeviceEstado | null>(null);
    const [control, setControl] = useState<DeviceControl | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!deviceId) return;

        setLoading(true);
        setError(null);

        // Initial load
        Promise.all([
            databaseService.getDeviceEstado(deviceId),
            databaseService.getDeviceControl(deviceId)
        ]).then(([initialEstado, initialControl]) => {
            setEstado(initialEstado);
            setControl(initialControl);
            setLoading(false);
        }).catch(err => {
            console.error('Error loading device data:', err);
            setError('Error al cargar datos del dispositivo');
            setLoading(false);
        });

        // Real-time listeners
        const unsubscribeEstado = databaseService.onEstadoChange(deviceId, (newEstado) => {
            setEstado(newEstado);
        });

        const unsubscribeControl = databaseService.onControlChange(deviceId, (newControl) => {
            setControl(newControl);
        });

        // Cleanup
        return () => {
            unsubscribeEstado();
            unsubscribeControl();
        };
    }, [deviceId]);

    return { estado, control, loading, error };
}
