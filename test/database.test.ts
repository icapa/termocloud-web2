import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FirebaseDatabaseService } from '../src/services/database';
import type { ConfigEntry, DeviceControl, DeviceEstado, EventoEntry, RegistroEntry } from '../src/types/database';

// Mock Firebase Database
const mockGet = vi.fn();
const mockSet = vi.fn();
const mockUpdate = vi.fn();
const mockRemove = vi.fn();
const mockOnValue = vi.fn();
const mockRef = vi.fn();

vi.mock('firebase/database', () => ({
    ref: (...args: any[]) => mockRef(...args),
    get: (...args: any[]) => mockGet(...args),
    set: (...args: any[]) => mockSet(...args),
    update: (...args: any[]) => mockUpdate(...args),
    remove: (...args: any[]) => mockRemove(...args),
    onValue: (...args: any[]) => mockOnValue(...args),
}));

// Mock the firebase.ts file
vi.mock('../src/firebase', () => ({
    db: {},
}));

describe('FirebaseDatabaseService', () => {
    let service: FirebaseDatabaseService;
    const testDeviceId = '00000000bceb13f1';

    beforeEach(() => {
        service = new FirebaseDatabaseService({} as any);
        vi.clearAllMocks();
    });

    // ==================== Configuration (conf) Tests ====================

    describe('Configuration Operations', () => {
        it('should get device configuration', async () => {
            const mockConfig = {
                '-LXrW-eyg7mVZ_8GiNbv': {
                    D: true,
                    J: true,
                    L: true,
                    M: true,
                    S: true,
                    V: true,
                    X: true,
                    enabled: true,
                    estadoForm: 'off',
                    hh_ff: '06:00',
                    hh_ii: '00:00',
                    id: '-LXrW-eyg7mVZ_8GiNbv',
                    temperatura: '20',
                },
            };

            mockGet.mockResolvedValue({
                exists: () => true,
                val: () => mockConfig,
            });

            const result = await service.getDeviceConfig(testDeviceId);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/conf`);
            expect(mockGet).toHaveBeenCalled();
            expect(result).toEqual(mockConfig);
        });

        it('should return null when configuration does not exist', async () => {
            mockGet.mockResolvedValue({
                exists: () => false,
                val: () => null,
            });

            const result = await service.getDeviceConfig(testDeviceId);
            expect(result).toBeNull();
        });

        it('should set a configuration entry', async () => {
            const configEntry: ConfigEntry = {
                D: true,
                J: true,
                L: true,
                M: true,
                S: true,
                V: true,
                X: true,
                enabled: true,
                estadoForm: 'automatico',
                hh_ff: '23:00',
                hh_ii: '08:00',
                id: 'test-config-id',
                temperatura: 21,
            };

            mockSet.mockResolvedValue(undefined);

            await service.setConfigEntry(testDeviceId, 'test-config-id', configEntry);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/conf/test-config-id`);
            expect(mockSet).toHaveBeenCalled();
        });

        it('should update a configuration entry', async () => {
            const updates = { temperatura: 22, enabled: false };
            mockUpdate.mockResolvedValue(undefined);

            await service.updateConfigEntry(testDeviceId, 'test-config-id', updates);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/conf/test-config-id`);
            expect(mockUpdate).toHaveBeenCalled();
        });

        it('should delete a configuration entry', async () => {
            mockRemove.mockResolvedValue(undefined);

            await service.deleteConfigEntry(testDeviceId, 'test-config-id');
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/conf/test-config-id`);
            expect(mockRemove).toHaveBeenCalled();
        });

        it('should listen to configuration changes', () => {
            const callback = vi.fn();
            const mockUnsubscribe = vi.fn();
            mockOnValue.mockReturnValue(mockUnsubscribe);

            const unsubscribe = service.onConfigChange(testDeviceId, callback);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/conf`);
            expect(mockOnValue).toHaveBeenCalled();
            expect(unsubscribe).toBe(mockUnsubscribe);
        });
    });

    // ==================== Control Tests ====================

    describe('Control Operations', () => {
        it('should get device control', async () => {
            const mockControl: DeviceControl = {
                automatico: { temperatura: 20 },
                modo: 'automatico',
                off: { encendido: 0 },
                on: { encendido: 1 },
            };

            mockGet.mockResolvedValue({
                exists: () => true,
                val: () => mockControl,
            });

            const result = await service.getDeviceControl(testDeviceId);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/control`);
            expect(result).toEqual(mockControl);
        });

        it('should set device control', async () => {
            const control: DeviceControl = {
                automatico: { temperatura: 21 },
                modo: 'on',
                off: { encendido: 0 },
                on: { encendido: 1 },
            };

            mockSet.mockResolvedValue(undefined);

            await service.setDeviceControl(testDeviceId, control);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/control`);
            expect(mockSet).toHaveBeenCalled();
        });

        it('should update device control', async () => {
            const updates = { modo: 'off' };
            mockUpdate.mockResolvedValue(undefined);

            await service.updateDeviceControl(testDeviceId, updates);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/control`);
            expect(mockUpdate).toHaveBeenCalled();
        });

        it('should listen to control changes', () => {
            const callback = vi.fn();
            const mockUnsubscribe = vi.fn();
            mockOnValue.mockReturnValue(mockUnsubscribe);

            const unsubscribe = service.onControlChange(testDeviceId, callback);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/control`);
            expect(unsubscribe).toBe(mockUnsubscribe);
        });
    });

    // ==================== Estado Tests ====================

    describe('Estado Operations', () => {
        it('should get device estado', async () => {
            const mockEstado: DeviceEstado = {
                encendido: 0,
                fecha: '2026-01-20T23:30:09+01:00',
                registro: '',
                temperatura: 21,
                temperaturaObjetivo: 20,
            };

            mockGet.mockResolvedValue({
                exists: () => true,
                val: () => mockEstado,
            });

            const result = await service.getDeviceEstado(testDeviceId);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/estado`);
            expect(result).toEqual(mockEstado);
        });

        it('should set device estado', async () => {
            const estado: DeviceEstado = {
                encendido: 1,
                fecha: '2026-01-20T23:45:00+01:00',
                registro: 'test',
                temperatura: 22,
                temperaturaObjetivo: 21,
            };

            mockSet.mockResolvedValue(undefined);

            await service.setDeviceEstado(testDeviceId, estado);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/estado`);
            expect(mockSet).toHaveBeenCalled();
        });

        it('should update device estado', async () => {
            const updates = { encendido: 1 as 0 | 1, temperaturaObjetivo: 23 };
            mockUpdate.mockResolvedValue(undefined);

            await service.updateDeviceEstado(testDeviceId, updates);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/estado`);
            expect(mockUpdate).toHaveBeenCalled();
        });

        it('should listen to estado changes', () => {
            const callback = vi.fn();
            const mockUnsubscribe = vi.fn();
            mockOnValue.mockReturnValue(mockUnsubscribe);

            const unsubscribe = service.onEstadoChange(testDeviceId, callback);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/estado`);
            expect(unsubscribe).toBe(mockUnsubscribe);
        });
    });

    // ==================== Eventos Tests ====================

    describe('Eventos Operations', () => {
        it('should get all device eventos', async () => {
            const mockEventos = {
                '2019-02-03': {
                    '11:24:28': {
                        encendido: 1,
                        modo: 'off',
                        temperatura: 20,
                        temperaturaObjetivo: '22',
                    },
                    '11:24:34': {
                        encendido: 0,
                        modo: 'off',
                        temperatura: 20,
                        temperaturaObjetivo: '22',
                    },
                },
            };

            mockGet.mockResolvedValue({
                exists: () => true,
                val: () => mockEventos,
            });

            const result = await service.getDeviceEventos(testDeviceId);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/eventos`);
            expect(result).toEqual(mockEventos);
        });

        it('should get eventos by date', async () => {
            const mockEventosByDate = {
                '11:24:28': {
                    encendido: 1,
                    modo: 'off',
                    temperatura: 20,
                    temperaturaObjetivo: '22',
                },
            };

            mockGet.mockResolvedValue({
                exists: () => true,
                val: () => mockEventosByDate,
            });

            const result = await service.getEventosByDate(testDeviceId, '2019-02-03');
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/eventos/2019-02-03`);
            expect(result).toEqual(mockEventosByDate);
        });

        it('should set an evento entry', async () => {
            const evento: EventoEntry = {
                encendido: 1,
                modo: 'automatico',
                temperatura: 21,
                temperaturaObjetivo: 22,
            };

            mockSet.mockResolvedValue(undefined);

            await service.setEventoEntry(testDeviceId, '2019-02-03', '11:30:00', evento);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/eventos/2019-02-03/11:30:00`);
            expect(mockSet).toHaveBeenCalled();
        });

        it('should delete an evento entry', async () => {
            mockRemove.mockResolvedValue(undefined);

            await service.deleteEventoEntry(testDeviceId, '2019-02-03', '11:30:00');
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/eventos/2019-02-03/11:30:00`);
            expect(mockRemove).toHaveBeenCalled();
        });

        it('should listen to eventos changes', () => {
            const callback = vi.fn();
            const mockUnsubscribe = vi.fn();
            mockOnValue.mockReturnValue(mockUnsubscribe);

            const unsubscribe = service.onEventosChange(testDeviceId, callback);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/eventos`);
            expect(unsubscribe).toBe(mockUnsubscribe);
        });
    });

    // ==================== Registros Tests ====================

    describe('Registros Operations', () => {
        it('should get all device registros', async () => {
            const mockRegistros = {
                '2019-02-03': {
                    '11:30': {
                        encendido: -1,
                        fecha: '2019-02-03T11:30:37+01:00',
                        temperatura: 20,
                        temperaturaObjetivo: '22',
                    },
                    '12:00': {
                        encendido: 0,
                        fecha: '2019-02-03T12:00:04+01:00',
                        temperatura: 20,
                        temperaturaObjetivo: 22,
                    },
                },
            };

            mockGet.mockResolvedValue({
                exists: () => true,
                val: () => mockRegistros,
            });

            const result = await service.getDeviceRegistros(testDeviceId);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/registros`);
            expect(result).toEqual(mockRegistros);
        });

        it('should get registros by date', async () => {
            const mockRegistrosByDate = {
                '11:30': {
                    encendido: -1,
                    fecha: '2019-02-03T11:30:37+01:00',
                    temperatura: 20,
                    temperaturaObjetivo: '22',
                },
            };

            mockGet.mockResolvedValue({
                exists: () => true,
                val: () => mockRegistrosByDate,
            });

            const result = await service.getRegistrosByDate(testDeviceId, '2019-02-03');
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/registros/2019-02-03`);
            expect(result).toEqual(mockRegistrosByDate);
        });

        it('should set a registro entry', async () => {
            const registro: RegistroEntry = {
                encendido: 1,
                fecha: '2019-02-03T13:00:00+01:00',
                temperatura: 21,
                temperaturaObjetivo: 22,
            };

            mockSet.mockResolvedValue(undefined);

            await service.setRegistroEntry(testDeviceId, '2019-02-03', '13:00', registro);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/registros/2019-02-03/13:00`);
            expect(mockSet).toHaveBeenCalled();
        });

        it('should delete a registro entry', async () => {
            mockRemove.mockResolvedValue(undefined);

            await service.deleteRegistroEntry(testDeviceId, '2019-02-03', '13:00');
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/registros/2019-02-03/13:00`);
            expect(mockRemove).toHaveBeenCalled();
        });

        it('should listen to registros changes', () => {
            const callback = vi.fn();
            const mockUnsubscribe = vi.fn();
            mockOnValue.mockReturnValue(mockUnsubscribe);

            const unsubscribe = service.onRegistrosChange(testDeviceId, callback);
            expect(mockRef).toHaveBeenCalledWith({}, `${testDeviceId}/registros`);
            expect(unsubscribe).toBe(mockUnsubscribe);
        });
    });

    // ==================== Complete Device Tests ====================

    describe('Complete Device Operations', () => {
        it('should get complete device data', async () => {
            const mockDevice = {
                conf: {},
                control: {
                    automatico: { temperatura: 20 },
                    modo: 'automatico',
                    off: { encendido: 0 },
                    on: { encendido: 1 },
                },
                estado: {
                    encendido: 0,
                    fecha: '2026-01-20T23:30:09+01:00',
                    registro: '',
                    temperatura: 21,
                    temperaturaObjetivo: 20,
                },
            };

            mockGet.mockResolvedValue({
                exists: () => true,
                val: () => mockDevice,
            });

            const result = await service.getDevice(testDeviceId);
            expect(mockRef).toHaveBeenCalledWith({}, testDeviceId);
            expect(result).toEqual(mockDevice);
        });

        it('should get all devices', async () => {
            const mockDevices = {
                '00000000bceb13f1': {
                    conf: {},
                    control: { modo: 'automatico' },
                    estado: { temperatura: 21 },
                },
            };

            mockGet.mockResolvedValue({
                exists: () => true,
                val: () => mockDevices,
            });

            const result = await service.getAllDevices();
            expect(mockRef).toHaveBeenCalledWith({}, '/');
            expect(result).toEqual(mockDevices);
        });
    });
});
