
import { describe, it, expect } from 'vitest';
import { calculateHeatingConsumption, ConsumptionEvent } from './consumption';

describe('calculateHeatingConsumption', () => {
    it('should calculate 0 consumption if no events and default off', () => {
        const events: ConsumptionEvent[] = [];
        const result = calculateHeatingConsumption(events, '2023-01-01', '2023-01-01');
        expect(result[0].seconds).toBe(0);
    });

    it('should calculate full day consumption if started ON before range', () => {
        const events: ConsumptionEvent[] = [
            { time: '2022-12-31T20:00:00', encendido: 1 } // Started ON yesterday
        ];
        // Full day 2023-01-01 is 24 * 60 * 60 = 86400 seconds (approx, ignoring ms precision for now)
        // My logic uses ms math so it might be slight off if I don't handle bounds perfectly?
        // Let's check. 23:59:59.999 - 00:00:00.000 is basically 86400000 ms.
        // /1000 = 86400.

        const result = calculateHeatingConsumption(events, '2023-01-01', '2023-01-01');
        expect(Math.floor(result[0].seconds)).toBeCloseTo(86400, 1);
    });

    it('should calculate partial consumption within a day', () => {
        const events: ConsumptionEvent[] = [
            { time: '2023-01-01T12:00:00', encendido: 1 },
            { time: '2023-01-01T14:00:00', encendido: 0 }
        ];
        // 2 hours = 7200 seconds
        const result = calculateHeatingConsumption(events, '2023-01-01', '2023-01-01');
        expect(result[0].seconds).toBe(7200);
    });

    it('should handle consumption crossing midnight', () => {
        const events: ConsumptionEvent[] = [
            { time: '2023-01-01T23:00:00', encendido: 1 },
            { time: '2023-01-02T01:00:00', encendido: 0 }
        ];
        const result = calculateHeatingConsumption(events, '2023-01-01', '2023-01-02');

        expect(result.length).toBe(2);
        expect(result[0].date).toBe('2023-01-01');
        expect(result[0].seconds).toBe(3600); // 1 hour on first day

        expect(result[1].date).toBe('2023-01-02');
        expect(result[1].seconds).toBe(3600); // 1 hour on second day
    });

    it('should handle complex on/off patterns', () => {
        const events: ConsumptionEvent[] = [
            { time: '2023-01-01T10:00:00', encendido: 1 },
            { time: '2023-01-01T11:00:00', encendido: 0 }, // 1h
            { time: '2023-01-01T13:00:00', encendido: 1 },
            { time: '2023-01-01T13:30:00', encendido: 0 }  // 0.5h
        ];
        // Total 1.5h = 5400s
        const result = calculateHeatingConsumption(events, '2023-01-01', '2023-01-01');
        expect(result[0].seconds).toBe(5400);
    });
});
