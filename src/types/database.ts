// TypeScript interfaces for Firebase Realtime Database structure

/**
 * Represents a single configuration/schedule entry
 * Each device can have multiple configuration entries identified by their ID
 */
export interface ConfigEntry {
    /** Domingo (Sunday) */
    D: boolean;
    /** Jueves (Thursday) */
    J: boolean;
    /** Lunes (Monday) */
    L: boolean;
    /** Martes (Tuesday) */
    M: boolean;
    /** Sábado (Saturday) */
    S: boolean;
    /** Viernes (Friday) */
    V: boolean;
    /** Miércoles (Wednesday) */
    X: boolean;
    /** Whether this configuration entry is enabled */
    enabled: boolean;
    /** Estado del formulario: "off" | "automatico" | "on" */
    estadoForm: string;
    /** Hora de fin (formato HH:mm) */
    hh_ff: string;
    /** Hora de inicio (formato HH:mm) */
    hh_ii: string;
    /** Unique identifier for this configuration entry */
    id: string;
    /** Target temperature (can be string or number) */
    temperatura: string | number;
}

/**
 * Configuration collection for a device
 * Key is the configuration entry ID
 */
export interface DeviceConfig {
    [configId: string]: ConfigEntry;
}

/**
 * Control settings for automatic mode
 */
export interface AutomaticoControl {
    temperatura: number;
}

/**
 * Control settings for off mode
 */
export interface OffControl {
    encendido: 0;
}

/**
 * Control settings for on mode
 */
export interface OnControl {
    encendido: 1;
}

/**
 * Device control configuration
 */
export interface DeviceControl {
    automatico: AutomaticoControl;
    /** Current mode: "automatico" | "on" | "off" */
    modo: string;
    off: OffControl;
    on: OnControl;
}

/**
 * Current state of the device
 */
export interface DeviceEstado {
    /** 0 = off, 1 = on */
    encendido: 0 | 1;
    /** ISO 8601 timestamp */
    fecha: string;
    /** Log/registro information */
    registro: string;
    /** Current temperature reading */
    temperatura: number;
    /** Target temperature */
    temperaturaObjetivo: number;
}

/**
 * Single event entry
 * Represents a state change event at a specific time
 */
export interface EventoEntry {
    /** 0 = off, 1 = on */
    encendido: 0 | 1;
    /** Mode: "automatico" | "on" | "off" */
    modo: string;
    /** Current temperature */
    temperatura: number;
    /** Target temperature (can be string or number) */
    temperaturaObjetivo: string | number;
}

/**
 * Events for a specific date
 * Key is time in format HH:mm:ss
 */
export interface EventosByDate {
    [time: string]: EventoEntry;
}

/**
 * All events for a device
 * Key is date in format YYYY-MM-DD
 */
export interface DeviceEventos {
    [date: string]: EventosByDate;
}

/**
 * Single registro (log) entry
 * Represents a periodic log entry
 */
export interface RegistroEntry {
    /** -1, 0, or 1 indicating state */
    encendido: -1 | 0 | 1;
    /** ISO 8601 timestamp */
    fecha: string;
    /** Current temperature */
    temperatura: number;
    /** Target temperature (can be string or number) */
    temperaturaObjetivo: string | number;
}

/**
 * Registros for a specific date
 * Key is time in format HH:mm
 */
export interface RegistrosByDate {
    [time: string]: RegistroEntry;
}

/**
 * All registros for a device
 * Key is date in format YYYY-MM-DD
 */
export interface DeviceRegistros {
    [date: string]: RegistrosByDate;
}

/**
 * Complete device data structure
 */
export interface Device {
    conf: DeviceConfig;
    control: DeviceControl;
    estado: DeviceEstado;
    eventos?: DeviceEventos;
    registros?: DeviceRegistros;
}

/**
 * Root database structure
 * Key is the device ID (e.g., "00000000bceb13f1")
 */
export interface DatabaseStructure {
    [deviceId: string]: Device;
}

