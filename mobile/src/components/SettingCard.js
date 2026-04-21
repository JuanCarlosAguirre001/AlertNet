import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomSwitch from './CustomSwitch';

export default function SettingCard({ icon, title, subtitle, isActive, onToggle }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color="#894949" />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <CustomSwitch active={isActive} onValueChange={onToggle} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Efecto translúcido de la imagen
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: '#E9D7D7', // Rojo muy clarito como en tu diseño
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D2D2D',
  },
  subtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
});