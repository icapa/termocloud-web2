export interface WeatherData {
    temperature: number;
    weatherCode: number;
    sunrise: string;
    sunset: string;
}

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&daily=sunrise,sunset&timezone=auto`);
        if (!response.ok) {
            throw new Error('Weather fetch failed');
        }
        const data = await response.json();
        return {
            temperature: data.current.temperature_2m,
            weatherCode: data.current.weathercode,
            sunrise: data.daily.sunrise[0], // "2023-10-27T08:30"
            sunset: data.daily.sunset[0]    // "2023-10-27T18:45"
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
};
