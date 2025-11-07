import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WeatherCard } from "@/components/WeatherCard";
import { useToast } from "@/hooks/use-toast";

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

const Index = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) {
      toast({
        title: "Please enter a city name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Get latitude and longitude from city name
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error("City not found");
      }

      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Get weather data using latitude and longitude
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,surface_pressure&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error("Weather data not available");
      }

      const weatherData = await weatherResponse.json();
      const current = weatherData.current;

      // Map weather codes to conditions
      const getCondition = (code: number) => {
        if (code === 0) return "clear sky";
        if (code <= 3) return "partly cloudy";
        if (code <= 48) return "foggy";
        if (code <= 67) return "rainy";
        if (code <= 77) return "snowy";
        if (code <= 82) return "rainy";
        if (code <= 86) return "snowy";
        return "stormy";
      };

      // Map weather codes to icon codes (similar to OpenWeatherMap format)
      const getIcon = (code: number) => {
        if (code === 0) return "01d";
        if (code <= 3) return "02d";
        if (code <= 48) return "50d";
        if (code <= 67) return "10d";
        if (code <= 77) return "13d";
        if (code <= 82) return "09d";
        if (code <= 86) return "13d";
        return "11d";
      };
      
      setWeather({
        city: name,
        country: country || "",
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        condition: getCondition(current.weather_code),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        visibility: 10000, // Open-Meteo doesn't provide visibility, using default
        pressure: current.surface_pressure,
        icon: getIcon(current.weather_code),
      });

      toast({
        title: "Weather updated",
        description: `Showing weather for ${name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not find weather data for this city",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  if (weather) {
    return <WeatherCard weather={weather} onBack={() => setWeather(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-weather-sunny-start to-weather-sunny-end flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Weather App
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
            Enter your city to see the weather
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-14 text-lg pl-12 bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 rounded-2xl"
              disabled={loading}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          </div>
          
          <Button
            type="submit"
            className="w-full h-14 text-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Weather"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/70">
            Try: New York, London, Tokyo, Paris...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
