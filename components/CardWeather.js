import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CardWeather = ({ time, icon, temp, description }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.time}>{time}h</Text>
      <Image source={{ uri: `http://openweathermap.org/img/wn/${icon}.png` }} style={styles.icon} />
      <Text style={styles.temp}>{Math.round(temp)}°C</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    width: 80,
  },
  time: {
    fontSize: 14,
    fontWeight: "bold",
  },
  icon: {
    width: 50,
    height: 50,
  },
  temp: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    textAlign: "center",
  },
});

export default CardWeather;
