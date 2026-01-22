import { useState, useEffect } from 'preact/hooks';
import { databaseService } from '../services/database';
import type { DeviceConfig, ConfigEntry } from '../types/database';

interface DeviceConfigCardProps {
    deviceId: string;
}

export function DeviceConfigCard({ deviceId }: DeviceConfigCardProps) {
    const [config, setConfig] = useState<DeviceConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = databaseService.onConfigChange(deviceId, (data) => {
            setConfig(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [deviceId]);

    const configList = config ? Object.values(config) : [];
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [editForm, setEditForm] = useState<Partial<ConfigEntry>>({});

    const handleStartEdit = (e: Event, entry: ConfigEntry) => {
        e.stopPropagation();
        setEditingId(entry.id);
        setEditForm({ ...entry });
        setDeletingId(null);
        setIsCreating(false);
    };

    const handleCancelEdit = (e: Event) => {
        e.stopPropagation();
        setEditingId(null);
        setEditForm({});
    };

    const handleStartDelete = (e: Event, entry: ConfigEntry) => {
        e.stopPropagation();
        setDeletingId(entry.id);
        setEditingId(null);
        setIsCreating(false);
    };

    const handleCancelDelete = (e: Event) => {
        e.stopPropagation();
        setDeletingId(null);
    };

    const handleStartCreate = () => {
        setIsCreating(true);
        setEditingId(null);
        setDeletingId(null);
        const defaultEntry: Partial<ConfigEntry> = {
            temperatura: 21,
            hh_ii: "08:00",
            hh_ff: "22:00",
            estadoForm: "on",
            enabled: true,
            L: true, M: true, X: true, J: true, V: true, S: false, D: false
        };
        setEditForm(defaultEntry);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setEditForm({});
    };

    const handleSaveNew = async () => {
        if (!editForm) return;
        try {
            await databaseService.createConfigEntry(deviceId, editForm as Omit<ConfigEntry, 'id'>);
            setIsCreating(false);
            setEditForm({});
        } catch (error) {
            console.error('Error creating config:', error);
        }
    };

    const handleConfirmDelete = async (e: Event) => {
        e.stopPropagation();
        if (!deletingId) return;
        try {
            await databaseService.deleteConfigEntry(deviceId, deletingId);
            setDeletingId(null);
        } catch (error) {
            console.error('Error deleting config:', error);
        }
    };

    const handleSaveEdit = async (e: Event) => {
        e.stopPropagation();
        if (!editingId || !editForm) return;

        try {
            await databaseService.updateConfigEntry(deviceId, editingId, {
                temperatura: Number(editForm.temperatura),
                hh_ii: editForm.hh_ii,
                hh_ff: editForm.hh_ff,
                estadoForm: editForm.estadoForm
            });
            setEditingId(null);
            setEditForm({});
        } catch (error) {
            console.error('Error updating config:', error);
        }
    };

    const handleEditChange = (field: keyof ConfigEntry, value: any) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleToggleEnabled = async (entry: ConfigEntry) => {
        if (editingId === entry.id) return; // Disable toggle while editing
        try {
            await databaseService.updateConfigEntry(deviceId, entry.id, {
                enabled: !entry.enabled
            });
        } catch (error) {
            console.error('Error toggling enabled:', error);
        }
    };

    const handleToggleDay = async (e: Event, entry: ConfigEntry, dayKey: string) => {
        e.stopPropagation(); // Prevent card click
        try {
            await databaseService.updateConfigEntry(deviceId, entry.id, {
                [dayKey]: !(entry as any)[dayKey]
            });
        } catch (error) {
            console.error('Error toggling day:', error);
        }
    };

    // Helper to format days
    const formatDays = (entry: ConfigEntry) => {
        const days = [
            { key: 'L', label: 'L' },
            { key: 'M', label: 'M' },
            { key: 'X', label: 'X' },
            { key: 'J', label: 'J' },
            { key: 'V', label: 'V' },
            { key: 'S', label: 'S' },
            { key: 'D', label: 'D' },
        ];
        return days.map(d => (
            <button
                key={d.key}
                onClick={(e) => handleToggleDay(e, entry, d.key)}
                style={{
                    background: (entry as any)[d.key] ? 'var(--accent)' : 'transparent',
                    color: (entry as any)[d.key] ? 'var(--bg-main)' : 'var(--text-secondary)',
                    border: (entry as any)[d.key] ? '1px solid var(--accent)' : '1px solid var(--border)',
                    opacity: (entry as any)[d.key] ? 1 : 0.5,
                    fontWeight: 'bold',
                    marginRight: '4px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '0.75rem',
                    transition: 'all 0.2s'
                }}
            >
                {d.label}
            </button>
        ));
    };

    // Helper to ensure time is HH:mm for input
    const normalizeTime = (time: string | undefined) => {
        if (!time) return '';
        // If "H:mm", pad with 0
        if (time.indexOf(':') === 1) return `0${time}`;
        return time;
    };

    return (
        <div className="htb-card" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    CONFIGURACIÓN
                </h3>
                {/* Placeholder for Add Button */}
                {/* 
                <button className="htb-button-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    + AÑADIR
                </button>
                */}
            </div>

            <div style={{ overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        <span className="pulse-green">CARGANDO CONFIGURACIÓN...</span>
                    </div>
                ) : configList.length > 0 ? (
                    configList.map((entry) => (
                        <div
                            key={entry.id}
                            onClick={() => handleToggleEnabled(entry)}
                            style={{
                                background: 'var(--bg-main)',
                                border: entry.enabled ? '1px solid var(--accent)' : '1px solid var(--border)',
                                borderRadius: '6px',
                                padding: '1rem',
                                position: 'relative',
                                opacity: entry.enabled ? 1 : 0.6,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: entry.enabled ? '0 0 10px -5px var(--accent-glow)' : 'none'
                            }}
                        >
                            {!entry.enabled && (
                                <div style={{
                                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                                    fontSize: '0.65rem', background: 'var(--text-secondary)', color: 'var(--bg-main)',
                                    padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'
                                }}>
                                    DESHABILITADO
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                {deletingId === entry.id ? (
                                    <div style={{ width: '100%', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 0' }} onClick={e => e.stopPropagation()}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>¿Eliminar esta configuración?</div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                onClick={handleCancelDelete}
                                                style={{ background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                CANCELAR
                                            </button>
                                            <button
                                                onClick={handleConfirmDelete}
                                                style={{ background: 'red', border: 'none', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                ELIMINAR
                                            </button>
                                        </div>
                                    </div>
                                ) : editingId === entry.id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }} onClick={e => e.stopPropagation()}>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input
                                                type="number"
                                                value={editForm.temperatura}
                                                onInput={(e) => handleEditChange('temperatura', (e.target as HTMLInputElement).value)}
                                                style={{ width: '60px', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--accent)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '1rem' }}
                                            />
                                            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>°C</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input
                                                type="time"
                                                value={normalizeTime(editForm.hh_ii)}
                                                onInput={(e) => handleEditChange('hh_ii', (e.target as HTMLInputElement).value)}
                                                style={{ flex: 1, padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--accent)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontFamily: 'monospace' }}
                                            />
                                            <span>-</span>
                                            <input
                                                type="time"
                                                value={normalizeTime(editForm.hh_ff)}
                                                onInput={(e) => handleEditChange('hh_ff', (e.target as HTMLInputElement).value)}
                                                style={{ flex: 1, padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--accent)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontFamily: 'monospace' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <select
                                                value={editForm.estadoForm}
                                                onChange={(e) => handleEditChange('estadoForm', (e.target as HTMLSelectElement).value)}
                                                style={{ width: '100%', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--accent)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                                            >
                                                <option value="off">OFF</option>
                                                <option value="on">ON</option>
                                                <option value="automatico">AUTO</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <button
                                                onClick={handleCancelEdit}
                                                style={{ background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                CANCELAR
                                            </button>
                                            <button
                                                onClick={handleSaveEdit}
                                                style={{ background: 'var(--accent)', border: 'none', color: 'var(--bg-main)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                GUARDAR
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {entry.estadoForm !== 'off' ? (
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                                {entry.temperatura}°C
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'transparent', userSelect: 'none' }}>
                                                --
                                            </div>
                                        )}
                                        <div className="htb-mono" style={{ color: 'var(--accent)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>{entry.hh_ii} - {entry.hh_ff}</span>
                                            <button
                                                onClick={(e) => handleStartEdit(e, entry)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => handleStartDelete(e, entry)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18"></path>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="htb-mono" style={{ fontSize: '0.8rem' }}>
                                    {formatDays(entry)}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                    {entry.estadoForm === 'automatico' ? 'Auto' : entry.estadoForm}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        No hay configuraciones activas.
                    </div>
                )}

                {isCreating && (
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginTop: '1rem',
                        border: '1px solid var(--accent)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginBottom: '0.5rem' }}>Nueva Configuración</div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="number"
                                    value={editForm.temperatura}
                                    onInput={(e) => handleEditChange('temperatura', (e.target as HTMLInputElement).value)}
                                    style={{ width: '60px', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--accent)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '1rem' }}
                                />
                                <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>°C</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="time"
                                    value={normalizeTime(editForm.hh_ii)}
                                    onInput={(e) => handleEditChange('hh_ii', (e.target as HTMLInputElement).value)}
                                    style={{ flex: 1, padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--accent)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontFamily: 'monospace' }}
                                />
                                <span>-</span>
                                <input
                                    type="time"
                                    value={normalizeTime(editForm.hh_ff)}
                                    onInput={(e) => handleEditChange('hh_ff', (e.target as HTMLInputElement).value)}
                                    style={{ flex: 1, padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--accent)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontFamily: 'monospace' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <select
                                    value={editForm.estadoForm}
                                    onChange={(e) => handleEditChange('estadoForm', (e.target as HTMLSelectElement).value)}
                                    style={{ width: '100%', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--accent)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                                >
                                    <option value="off">OFF</option>
                                    <option value="on">ON</option>
                                    <option value="automatico">AUTO</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button
                                    onClick={handleCancelCreate}
                                    style={{ background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={handleSaveNew}
                                    style={{ background: 'var(--accent)', border: 'none', color: 'var(--bg-main)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    GUARDAR
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!isCreating && (
                    <button
                        onClick={handleStartCreate}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            marginTop: '1rem',
                            background: 'transparent',
                            border: '2px dashed var(--accent)',
                            borderRadius: '12px',
                            color: 'var(--accent)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        NUEVA CONFIGURACIÓN
                    </button>
                )}
            </div>
        </div>
    );
}
