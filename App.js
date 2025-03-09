import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList, Pressable, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CardWeather from './components/CardWeather';


function OtherScreen() {
  return (
    <View><Text>text</Text></View>
  )
}
function WeatherScreen() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherSelected, setWeatherSelected] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
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

  const changeWeatherSelected = (day) => {
    setSelectedDay(day);
    if (day == 1) {
      setWeatherSelected(weather?.list.slice(0, 8))
    } else if (day == 2){
      setWeatherSelected(weather?.list.slice(8, 16))
    } else if (day == 3){
      setWeatherSelected(weather?.list.slice(16, 24))
    } else if (day == 4){
      setWeatherSelected(weather?.list.slice(24, 32))
    } else{
      setWeatherSelected(weather?.list.slice(32, 40))
    }
  }

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
        setWeatherSelected(data.list.slice(0, 8));

      } catch (error) {
        console.error("Erreur lors de la récupération des données météo :", error);
      }
    }
    getWeatherApi();
  }, [location]);
  return (
    <View style={styles.container}>
      {weather ? (
        <View style={styles.topContainer}>
          <View style={styles.buttonDayContainer}>
            <Pressable onPress={() => changeWeatherSelected(1)} style={[styles.buttonDay, selectedDay === 1 && styles.selectedButton]}><Text>J1</Text></Pressable>
            <Pressable onPress={() => changeWeatherSelected(2)} style={[styles.buttonDay, selectedDay === 2 && styles.selectedButton]}><Text>J2</Text></Pressable>
            <Pressable onPress={() => changeWeatherSelected(3)} style={[styles.buttonDay, selectedDay === 3 && styles.selectedButton]}><Text>J3</Text></Pressable>
            <Pressable onPress={() => changeWeatherSelected(4)} style={[styles.buttonDay, selectedDay === 4 && styles.selectedButton]}><Text>J4</Text></Pressable>
            <Pressable onPress={() => changeWeatherSelected(5)} style={[styles.buttonDay, selectedDay === 5 && styles.selectedButton]}><Text>J5</Text></Pressable>
          </View>
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherCity}>{weather.city.name}</Text>
            <Image
              source={{ uri: `http://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}.png`}}
              style={styles.weatherLogo}
            />
            <Text style={styles.weatherCelsius}>{Math.round(weather.list[0].main.temp)}°C</Text>
            <Text style={styles.weatherDescription}>{weather.list[0].weather[0].description}</Text>
          </View>
        </View>
        ) : (
          <View>
            <ActivityIndicator size="large" color="#3b9cf8" />
            <Text>Le contenu est en cours de chargement</Text>
          </View>
        )
      }
      <View style={styles.weatherDayContainer}>
        <FlatList
          horizontal
          data={weatherSelected}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <CardWeather
              time={new Date(item.dt * 1000).getHours()}
              icon={item.weather[0].icon}
              temp={item.main.temp}
              description={item.weather[0].description}
            />
          )}
        />
      </View>
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
  weatherText: {
    marginBottom: 10
  },
  weatherDayContainer: {
    marginTop: 40,
    height: 150
  },
  weatherContainer: {
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    width: 250,
    height: 200,
  },
  weatherLogo: {
    width: 100,
    height: 100,
  },
  weatherCelsius: {
    fontSize: 16,
    fontWeight: "bold",
  },
  weatherDescription: {
    fontSize: 12,
    textAlign: "center",
  },
  buttonDayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom:40
  },
  buttonDay: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingVertical:5,
    borderRadius: 5,
    margin: 0
  },
  topContainer: {
    alignItems: 'center'
  },
  selectedButton: {
    backgroundColor: '#3b9cf8'
  }
});

const BottomTab = createBottomTabNavigator({
  screens: {
    Weather: WeatherScreen,
    OtherScreen: OtherScreen,
  },
});

const Navigation = createStaticNavigation(BottomTab);

export default function App() {
  return <Navigation />;
}