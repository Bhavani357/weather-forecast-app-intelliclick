export interface City {
    name: string;
    cou_name_en: string;
    timezone: string;
    population: number;
  }
  
export interface WeatherData {
  current: {
    temp: number;
    weather: { description: string }[];
    humidity: number;
    wind_speed: number;
    pressure: number;
  };
  forecast: Array<{
    dt_txt: string;
    main: { temp_min: number; temp_max: number };
    weather: { description: string }[];
  }>;
}


