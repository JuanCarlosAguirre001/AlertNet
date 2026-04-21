import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

export default function CustomSwitch({ active, onValueChange }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => onValueChange(!active)}
      style={[
        styles.switchBase, 
        { backgroundColor: active ? '#4A1414' : '#D1D1D1' } // Rojo oscuro si está activo
      ]}
    >
      <View style={[
        styles.circle, 
        { alignSelf: active ? 'flex-end' : 'flex-start' }
      ]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  switchBase: {
    width: 45,
    height: 24,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'white',
    // Sombra sutil
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});