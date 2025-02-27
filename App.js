import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(null);
  const apiKey = "198a70155c23d31f52cbf6ff05f413b4";


  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);



  useEffect(() => {
    async function getWeatherApi() {
      if (!location) return;
      
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;
      
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`
        );
        const data = await response.json();
        setWeather(data);

      } catch (error) {
        console.error("Erreur lors de la récupération des données météo :", error);
      }
    }

    getWeatherApi();
  }, [location]);
  return (
    <View style={styles.container}>
      {weather && 
      <View style={styles.weatherContainer}>
        <Text style={styles.weatherText}>{weather.city.name}</Text>
        <Image
          source={{ uri: `http://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}.png`}}
          style={styles.weatherLogo}
        />
        <Text style={styles.weatherText}>{Math.round(weather.list[0].main.temp)}°C</Text>
        <Text>{weather.list[0].weather[0].description}</Text>
      </View>
      
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherLogo: {
    backgroundColor: '#f9f9f9',
    width:100,
    height:100,
    marginBottom: 10,
  },
  weatherContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  weatherText: {
    marginBottom: 10
  }
});
