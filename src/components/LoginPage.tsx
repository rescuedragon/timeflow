import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Lock, User, Clock, Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';
import './login/LoginPage.css';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    icon: 'cloud'
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  // Update time every second and weather every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Update weather every minute
    const weatherTimer = setInterval(() => {
      updateWeather();
    }, 60000);

    // Initial weather fetch
    updateWeather();

    // Animation trigger
    setTimeout(() => setAnimated(true), 100);

    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
    };
  }, []);

  const updateWeather = () => {
    // Simulate weather data for Bengaluru (in a real app, you'd fetch from an API)
    const conditions = [
      { temp: 28, condition: 'Partly Cloudy', humidity: 65, wind: 12, icon: 'cloud' },
      { temp: 30, condition: 'Sunny', humidity: 58, wind: 8, icon: 'sun' },
      { temp: 26, condition: 'Light Rain', humidity: 78, wind: 15, icon: 'rain' },
      { temp: 29, condition: 'Clear', humidity: 62, wind: 10, icon: 'sun' }
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    setWeather({
      temperature: randomCondition.temp,
      condition: randomCondition.condition,
      humidity: randomCondition.humidity,
      windSpeed: randomCondition.wind,
      icon: randomCondition.icon
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
  };

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sun':
        return <Sun className="weather-icon" />;
      case 'cloud':
        return <Cloud className="weather-icon" />;
      case 'rain':
        return <CloudRain className="weather-icon" />;
      case 'snow':
        return <CloudSnow className="weather-icon" />;
      default:
        return <Cloud className="weather-icon" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token and user data
        localStorage.setItem('timeflo_token', data.token);
        localStorage.setItem('timeflo_user', JSON.stringify(data.user));
        localStorage.setItem('timeflo_has_logged_in', 'true');
        onLoginSuccess();
      } else {
        setError(data.error || 'Login failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check if the server is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      {/* Brand Title - Top Left */}
      <h1 className="brand-title">
        <span className="brand-gradient">Timesheet</span>
      </h1>

      {/* Time & Weather Display - Top Right */}
      <div className="time-weather-display">
        {/* Time Widget */}
        <div className="time-widget">
          <div className="time-content">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
        </div>
        
        {/* Weather Widget */}
        <div className="weather-widget">
          <div className="weather-content">
            <div className="weather-main">
              <div className="weather-icon-temp">
                {getWeatherIcon(weather.icon)}
                <span className="temperature">{weather.temperature}°</span>
              </div>
              <div className="weather-details">
                <div className="condition">{weather.condition}</div>
                <div className="location">Bengaluru</div>
              </div>
            </div>
            <div className="weather-stats">
              <div className="stat">
                <Wind className="stat-icon" />
                <span>{weather.windSpeed} km/h</span>
              </div>
              <div className="stat">
                <div className="humidity-icon">💧</div>
                <span>{weather.humidity}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Login Card */}
      <div className="login-content">
        <div 
          ref={cardRef}
          className={`login-card ${animated ? 'card-entered' : ''}`}
        >
          <div className="login-header">
            <h2 className="welcome-title">Welcome back</h2>
            <p className="welcome-subtitle">{formatDate(currentTime)}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Field */}
            <div className="input-group">
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                />
                <div className="input-highlight"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="input-group">
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <div className="input-highlight"></div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <div className="error-content">{error}</div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className={`login-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
              <span className="button-highlight"></span>
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;