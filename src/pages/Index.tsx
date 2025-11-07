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
      // Using OpenWeatherMap API - you'll need to add your API key
      const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; // Free demo key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      
      setWeather({
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        visibility: data.visibility,
        pressure: data.main.pressure,
        icon: data.weather[0].icon,
      });

      toast({
        title: "Weather updated",
        description: `Showing weather for ${data.name}`,
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
