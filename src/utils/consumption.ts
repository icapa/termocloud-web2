
export interface ConsumptionEvent {
    time: string; // ISO string or "YYYY-MM-DD HH:mm:ss"
    encendido: 0 | 1;
}

export interface DayConsumption {
    date: string; // YYYY-MM-DD
    seconds: number;
}

/**
 * Calculates heating consumption (time in seconds) for each day in the given range.
 * 
 * @param events List of events. Timestamps should be sortable ISO strings or similar.
 * @param startDateStr Start date (YYYY-MM-DD) inclusive (starts at 00:00:00)
 * @param endDateStr End date (YYYY-MM-DD) inclusive (ends at 23:59:59.999... effectively up to next day 00:00:00)
 * @returns Array of daily consumption
 */
export function calculateHeatingConsumption(
    events: ConsumptionEvent[],
    startDateStr: string,
    endDateStr: string
): DayConsumption[] {
    // 1. Setup boundaries
    // Start range: 00:00:00 local
    const startRange = new Date(`${startDateStr}T00:00:00`);

    // End range: Start of the day AFTER the user-requested end date
    // logic: user wants "2023-01-01" to "2023-01-01" (1 day).
    // range: 2023-01-01 00:00:00 TO 2023-01-02 00:00:00 (exclusive)
    const endRange = new Date(`${endDateStr}T00:00:00`);
    endRange.setDate(endRange.getDate() + 1);

    // 2. Sort events by time
    const sortedEvents = [...events].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    // 3. Initialize result map
    const consumptionByDay: Record<string, number> = {};

    // Helper to format date "YYYY-MM-DD" in local time
    const getLocalDateKey = (timestamp: number): string => {
        const d = new Date(timestamp);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    // Helper to add seconds to a day
    const addConsumption = (timestamp: number, durationSeconds: number) => {
        const dateKey = getLocalDateKey(timestamp);
        // Only count if within our overall requested range
        if (dateKey >= startDateStr && dateKey <= endDateStr) {
            consumptionByDay[dateKey] = (consumptionByDay[dateKey] || 0) + durationSeconds;
        }
    };

    // 4. Processing

    // Filter events to those strictly before our "Exclusive End Range"
    const relevantEvents = sortedEvents.filter(e => new Date(e.time).getTime() < endRange.getTime());

    // Find initial state from events before startRange
    let currentState: 0 | 1 = 0;
    const eventsBeforeStart = sortedEvents.filter(e => new Date(e.time).getTime() < startRange.getTime());
    if (eventsBeforeStart.length > 0) {
        currentState = eventsBeforeStart[eventsBeforeStart.length - 1].encendido;
    }

    // Iterate through relevant events relative to startRange
    const eventsInRange = relevantEvents.filter(e => new Date(e.time).getTime() >= startRange.getTime());

    let currentTime = startRange.getTime();

    for (const event of eventsInRange) {
        const eventTime = new Date(event.time).getTime();

        // If state is ON, accumulate duration
        if (currentState === 1) {
            let tempTime = currentTime;

            while (tempTime < eventTime) {
                // Find end of current day of tempTime (Next day 00:00:00)
                const d = new Date(tempTime);
                d.setHours(24, 0, 0, 0); // 00:00:00 of next day
                const nextDayStart = d.getTime();

                // Segment ends at event or day boundary
                const segmentEnd = Math.min(eventTime, nextDayStart);

                const duration = (segmentEnd - tempTime) / 1000;

                if (duration > 0) {
                    addConsumption(tempTime, duration);
                }

                tempTime = segmentEnd;
            }
        }

        currentState = event.encendido;
        currentTime = eventTime;
    }

    // Handle Time from last event to endRange
    if (currentState === 1 && currentTime < endRange.getTime()) {
        let tempTime = currentTime;
        const finalTime = endRange.getTime();

        while (tempTime < finalTime) {
            const d = new Date(tempTime);
            d.setHours(24, 0, 0, 0);
            const nextDayStart = d.getTime();

            const segmentEnd = Math.min(finalTime, nextDayStart);
            const duration = (segmentEnd - tempTime) / 1000;

            if (duration > 0) {
                addConsumption(tempTime, duration);
            }

            tempTime = segmentEnd;
        }
    }

    // Format output
    const days: DayConsumption[] = [];
    const loopDate = new Date(startRange);

    // Loop until we reach endRange (exclusive)
    while (loopDate.getTime() < endRange.getTime()) {
        const dateStr = getLocalDateKey(loopDate.getTime());
        days.push({
            date: dateStr,
            seconds: consumptionByDay[dateStr] || 0
        });

        loopDate.setDate(loopDate.getDate() + 1);

        if (days.length > 366) break;
    }

    return days;
}
