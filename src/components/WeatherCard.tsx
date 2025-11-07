import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  icon: string;
}

interface WeatherCardProps {
  weather: WeatherData;
}

const getWeatherIcon = (condition: string, iconCode: string) => {
  const isNight = iconCode.includes('n');
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return <CloudRain className="w-24 h-24 md:w-32 md:h-32 animate-float" />;
  }
  if (conditionLower.includes('cloud')) {
    return <Cloud className="w-24 h-24 md:w-32 md:h-32 animate-float" />;
  }
  return <Sun className="w-24 h-24 md:w-32 md:h-32 animate-float" />;
};

const getWeatherGradient = (condition: string, iconCode: string) => {
  const isNight = iconCode.includes('n');
  const conditionLower = condition.toLowerCase();
  
  if (isNight) {
    return 'from-weather-night-start to-weather-night-end';
  }
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return 'from-weather-rainy-start to-weather-rainy-end';
  }
  if (conditionLower.includes('cloud')) {
    return 'from-weather-cloudy-start to-weather-cloudy-end';
  }
  return 'from-weather-sunny-start to-weather-sunny-end';
};

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  const gradient = getWeatherGradient(weather.condition, weather.icon);
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} flex items-center justify-center p-4 animate-fade-in`}>
      <Card className="w-full max-w-2xl bg-glass-bg backdrop-blur-xl border-glass-border shadow-2xl animate-slide-up">
        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {weather.city}, {weather.country}
            </h1>
            <p className="text-lg md:text-xl text-white/80 capitalize">{weather.condition}</p>
          </div>

          {/* Main Weather Display */}
          <div className="flex flex-col items-center mb-10">
            <div className="text-white/90 mb-4">
              {getWeatherIcon(weather.condition, weather.icon)}
            </div>
            <div className="text-7xl md:text-8xl font-bold text-white mb-2">
              {Math.round(weather.temperature)}°
            </div>
            <p className="text-xl md:text-2xl text-white/80">
              Feels like {Math.round(weather.feelsLike)}°
            </p>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Wind className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <p className="text-white/60 text-sm mb-1">Wind</p>
              <p className="text-white text-lg font-semibold">{weather.windSpeed} m/s</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Droplets className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <p className="text-white/60 text-sm mb-1">Humidity</p>
              <p className="text-white text-lg font-semibold">{weather.humidity}%</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Eye className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <p className="text-white/60 text-sm mb-1">Visibility</p>
              <p className="text-white text-lg font-semibold">{(weather.visibility / 1000).toFixed(1)} km</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Gauge className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <p className="text-white/60 text-sm mb-1">Pressure</p>
              <p className="text-white text-lg font-semibold">{weather.pressure} hPa</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
