import { ref, get, set, update, remove, onValue } from "firebase/database";
import type { Database, DatabaseReference, Unsubscribe } from "firebase/database";
import { db } from "../firebase";
import type {
    DeviceConfig,
    DeviceControl,
    DeviceEstado,
    Device,
    ConfigEntry,
    DeviceEventos,
    EventoEntry,
    EventosByDate,
    DeviceRegistros,
    RegistroEntry,
    RegistrosByDate,
} from "../types/database";

/**
 * Interface for database service operations
 */
export interface IDatabaseService {
    // Configuration (conf) operations
    getDeviceConfig(deviceId: string): Promise<DeviceConfig | null>;
    setConfigEntry(deviceId: string, configId: string, config: ConfigEntry): Promise<void>;
    updateConfigEntry(deviceId: string, configId: string, updates: Partial<ConfigEntry>): Promise<void>;
    deleteConfigEntry(deviceId: string, configId: string): Promise<void>;
    onConfigChange(deviceId: string, callback: (config: DeviceConfig | null) => void): Unsubscribe;

    // Control operations
    getDeviceControl(deviceId: string): Promise<DeviceControl | null>;
    setDeviceControl(deviceId: string, control: DeviceControl): Promise<void>;
    updateDeviceControl(deviceId: string, updates: Partial<DeviceControl>): Promise<void>;
    onControlChange(deviceId: string, callback: (control: DeviceControl | null) => void): Unsubscribe;

    // Estado operations
    getDeviceEstado(deviceId: string): Promise<DeviceEstado | null>;
    setDeviceEstado(deviceId: string, estado: DeviceEstado): Promise<void>;
    updateDeviceEstado(deviceId: string, updates: Partial<DeviceEstado>): Promise<void>;
    onEstadoChange(deviceId: string, callback: (estado: DeviceEstado | null) => void): Unsubscribe;

    // Eventos operations
    getDeviceEventos(deviceId: string): Promise<DeviceEventos | null>;
    getEventosByDate(deviceId: string, date: string): Promise<EventosByDate | null>;
    setEventoEntry(deviceId: string, date: string, time: string, evento: EventoEntry): Promise<void>;
    deleteEventoEntry(deviceId: string, date: string, time: string): Promise<void>;
    onEventosChange(deviceId: string, callback: (eventos: DeviceEventos | null) => void): Unsubscribe;

    // Registros operations
    getDeviceRegistros(deviceId: string): Promise<DeviceRegistros | null>;
    getRegistrosByDate(deviceId: string, date: string): Promise<RegistrosByDate | null>;
    setRegistroEntry(deviceId: string, date: string, time: string, registro: RegistroEntry): Promise<void>;
    deleteRegistroEntry(deviceId: string, date: string, time: string): Promise<void>;
    onRegistrosChange(deviceId: string, callback: (registros: DeviceRegistros | null) => void): Unsubscribe;

    // Complete device operations
    getDevice(deviceId: string): Promise<Device | null>;
    getAllDevices(): Promise<{ [deviceId: string]: Device } | null>;
}

/**
 * Firebase Realtime Database service implementation
 */
export class FirebaseDatabaseService implements IDatabaseService {
    private _db: Database;

    constructor(dbInstance: Database = db) {
        this._db = dbInstance;
    }

    // ==================== Configuration (conf) Operations ====================

    async getDeviceConfig(deviceId: string): Promise<DeviceConfig | null> {
        const configRef = ref(this._db, `${deviceId}/conf`);
        const snapshot = await get(configRef);
        return snapshot.exists() ? snapshot.val() : null;
    }

    async setConfigEntry(deviceId: string, configId: string, config: ConfigEntry): Promise<void> {
        const configEntryRef = ref(this._db, `${deviceId}/conf/${configId}`);
        await set(configEntryRef, config);
    }

    async updateConfigEntry(deviceId: string, configId: string, updates: Partial<ConfigEntry>): Promise<void> {
        const configEntryRef = ref(this._db, `${deviceId}/conf/${configId}`);
        await update(configEntryRef, updates);
    }

    async deleteConfigEntry(deviceId: string, configId: string): Promise<void> {
        const configEntryRef = ref(this._db, `${deviceId}/conf/${configId}`);
        await remove(configEntryRef);
    }

    onConfigChange(deviceId: string, callback: (config: DeviceConfig | null) => void): Unsubscribe {
        const configRef = ref(this._db, `${deviceId}/conf`);
        return onValue(configRef, (snapshot) => {
            callback(snapshot.exists() ? snapshot.val() : null);
        });
    }

    // ==================== Control Operations ====================

    async getDeviceControl(deviceId: string): Promise<DeviceControl | null> {
        const controlRef = ref(this._db, `${deviceId}/control`);
        const snapshot = await get(controlRef);
        return snapshot.exists() ? snapshot.val() : null;
    }

    async setDeviceControl(deviceId: string, control: DeviceControl): Promise<void> {
        const controlRef = ref(this._db, `${deviceId}/control`);
        await set(controlRef, control);
    }

    async updateDeviceControl(deviceId: string, updates: Partial<DeviceControl>): Promise<void> {
        const controlRef = ref(this._db, `${deviceId}/control`);
        await update(controlRef, updates);
    }

    onControlChange(deviceId: string, callback: (control: DeviceControl | null) => void): Unsubscribe {
        const controlRef = ref(this._db, `${deviceId}/control`);
        return onValue(controlRef, (snapshot) => {
            callback(snapshot.exists() ? snapshot.val() : null);
        });
    }

    // ==================== Estado Operations ====================

    async getDeviceEstado(deviceId: string): Promise<DeviceEstado | null> {
        const estadoRef = ref(this._db, `${deviceId}/estado`);
        const snapshot = await get(estadoRef);
        return snapshot.exists() ? snapshot.val() : null;
    }

    async setDeviceEstado(deviceId: string, estado: DeviceEstado): Promise<void> {
        const estadoRef = ref(this._db, `${deviceId}/estado`);
        await set(estadoRef, estado);
    }

    async updateDeviceEstado(deviceId: string, updates: Partial<DeviceEstado>): Promise<void> {
        const estadoRef = ref(this._db, `${deviceId}/estado`);
        await update(estadoRef, updates);
    }

    onEstadoChange(deviceId: string, callback: (estado: DeviceEstado | null) => void): Unsubscribe {
        const estadoRef = ref(this._db, `${deviceId}/estado`);
        return onValue(estadoRef, (snapshot) => {
            callback(snapshot.exists() ? snapshot.val() : null);
        });
    }

    // ==================== Eventos Operations ====================

    async getDeviceEventos(deviceId: string): Promise<DeviceEventos | null> {
        const eventosRef = ref(this._db, `${deviceId}/eventos`);
        const snapshot = await get(eventosRef);
        return snapshot.exists() ? snapshot.val() : null;
    }

    async getEventosByDate(deviceId: string, date: string): Promise<EventosByDate | null> {
        const eventosDateRef = ref(this._db, `${deviceId}/eventos/${date}`);
        const snapshot = await get(eventosDateRef);
        return snapshot.exists() ? snapshot.val() : null;
    }

    async setEventoEntry(deviceId: string, date: string, time: string, evento: EventoEntry): Promise<void> {
        const eventoRef = ref(this._db, `${deviceId}/eventos/${date}/${time}`);
        await set(eventoRef, evento);
    }

    async deleteEventoEntry(deviceId: string, date: string, time: string): Promise<void> {
        const eventoRef = ref(this._db, `${deviceId}/eventos/${date}/${time}`);
        await remove(eventoRef);
    }

    onEventosChange(deviceId: string, callback: (eventos: DeviceEventos | null) => void): Unsubscribe {
        const eventosRef = ref(this._db, `${deviceId}/eventos`);
        return onValue(eventosRef, (snapshot) => {
            callback(snapshot.exists() ? snapshot.val() : null);
        });
    }

    // ==================== Registros Operations ====================

    async getDeviceRegistros(deviceId: string): Promise<DeviceRegistros | null> {
        const registrosRef = ref(this._db, `${deviceId}/registros`);
        const snapshot = await get(registrosRef);
        return snapshot.exists() ? snapshot.val() : null;
    }

    async getRegistrosByDate(deviceId: string, date: string): Promise<RegistrosByDate | null> {
        const registrosDateRef = ref(this._db, `${deviceId}/registros/${date}`);
        const snapshot = await get(registrosDateRef);
        return snapshot.exists() ? snapshot.val() : null;
    }

    async setRegistroEntry(deviceId: string, date: string, time: string, registro: RegistroEntry): Promise<void> {
        const registroRef = ref(this._db, `${deviceId}/registros/${date}/${time}`);
        await set(registroRef, registro);
    }

    async deleteRegistroEntry(deviceId: string, date: string, time: string): Promise<void> {
        const registroRef = ref(this._db, `${deviceId}/registros/${date}/${time}`);
        await remove(registroRef);
    }

    onRegistrosChange(deviceId: string, callback: (registros: DeviceRegistros | null) => void): Unsubscribe {
        const registrosRef = ref(this._db, `${deviceId}/registros`);
        return onValue(registrosRef, (snapshot) => {
            callback(snapshot.exists() ? snapshot.val() : null);
        });
    }

    // ==================== Complete Device Operations ====================

    async getDevice(deviceId: string): Promise<Device | null> {
        const deviceRef = ref(this._db, deviceId);
        const snapshot = await get(deviceRef);
        return snapshot.exists() ? snapshot.val() : null;
    }

    async getAllDevices(): Promise<{ [deviceId: string]: Device } | null> {
        const devicesRef = ref(this._db, "/");
        const snapshot = await get(devicesRef);
        return snapshot.exists() ? snapshot.val() : null;
    }
}

// Export singleton instance
export const databaseService = new FirebaseDatabaseService();
