import React, { useEffect, useRef } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Dimensions,Platform,Animated,Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

// Componentes
import Background from "../src/components/Background";
import Header from "../src/components/Header";
import BottomMenu from "../src/components/BottomMenu";
import NotificationBell from "../src/components/NotificationBell";

const { width } = Dimensions.get('window');

export default function PanicScreen() {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de pulso más enérgica
    Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1800, // Un poco más rápida para que sea más notable
        easing: Easing.out(Easing.bezier(0.25, 0.46, 0.45, 0.94)),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolaciones para que el "foco" sea muy notorio
  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8], 
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.8, 0.4, 0], 
  });

  return (
    <Background>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.mainContainer}>
        <Header />
        <NotificationBell />

        <View style={styles.content}>
          <View style={styles.statusBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusText}>SISTEMA ACTIVO</Text>
          </View>

          <Text style={styles.title}>¿Necesitas ayuda?</Text>

          <View style={styles.instructionsContainer}>
            <View style={styles.instructionBanner}>
               <Ionicons name="finger-print" size={20} color="#4A1414" style={{ marginRight: 10 }} />
               <Text style={styles.instructionText}>
                 Mantén presionado para activar la alerta.
               </Text>
            </View>

            <Text style={styles.subTextSmall}>
              También puedes activar la alerta presionando el {"\n"}
              <Text style={styles.subTextSmall}>botón de volumen 3 veces.</Text>
            </Text>
          </View>

          <View style={styles.panicContainer}>
            {/* El Anillo que se mueve (Más notorio) */}
            <Animated.View 
              style={[
                styles.ringPulse,
                {
                  transform: [{ scale }],
                  opacity: opacity,
                }
              ]} 
            /> 

            <TouchableOpacity 
              style={styles.panicButtonOuter}
              activeOpacity={0.9}
              onLongPress={() => alert('¡ALERTA ENVIADA!')}
            >
              {/* Botón Rojo con Borde Blanco */}
              <View style={styles.panicButtonInner}>
                <Ionicons name="warning" size={64} color="white" />
                <Text style={styles.panicText}>ALERTA</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.locationCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={24} color="#B42424" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>ESTÁS EN</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>
                Santa Cruz de la Sierra, Bolivia
              </Text>
            </View>
            <TouchableOpacity style={styles.mapBtn}>
              <Text style={styles.mapText}>MAPA</Text>
            </TouchableOpacity>
          </View>
        </View>

        <BottomMenu currentRoute="panic" />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(227, 242, 253, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  pulseDot: { 
    width: 10, height: 10, borderRadius: 5, 
    backgroundColor: '#1976D2', marginRight: 10 
  },
  statusText: { 
    fontSize: 10, fontWeight: '900', color: '#1976D2', letterSpacing: 0.8 
  },
  title: { fontSize: 32, fontWeight: '900', color: '#000', marginBottom: 15 },
  instructionsContainer: { alignItems: 'center', marginBottom: 10 },
  instructionBanner: {
    backgroundColor: 'rgba(180, 36, 36, 0.08)',
    paddingHorizontal: 15, paddingVertical: 10,
    borderRadius: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12,
  },
  instructionText: { fontSize: 14, color: '#4A1414', fontWeight: '700' },
  subTextSmall: { textAlign: 'center', fontSize: 13, color: '#1f1f1f', lineHeight: 18 },
  

  panicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: width * 0.9,
    marginVertical: 10,
  },
  ringPulse: {
    position: 'absolute',
    width: width * 0.55, 
    height: width * 0.55,
    borderRadius: (width * 0.55) / 2,
    backgroundColor: 'rgba(180, 36, 36, 0.6)', // Más sólido al inicio
    zIndex: 1,
  },
  panicButtonOuter: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: 'rgba(180, 36, 36, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  panicButtonInner: {
    width: width * 0.58,
    height: width * 0.58,
    borderRadius: (width * 0.58) / 2,
    backgroundColor: '#B52C2C',
    justifyContent: 'center',
    alignItems: 'center',
    // EL BORDE BLANCO ESTILO FIGMA
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10,
    ...Platform.select({
      android: { elevation: 25 },
    }),
  },
  panicText: { 
    color: 'white', fontSize: 28, fontWeight: '900', 
    marginTop: 8, letterSpacing: 2 
  },

  locationCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 100,
    elevation: 4,
  },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FBE9E9', justifyContent: 'center', alignItems: 'center', marginRight:12,
  },
  locationInfo: { flex: 1 },
  locationLabel: { fontSize: 10, color: '#888', fontWeight: '900', marginBottom: 3 },
  locationAddress: { fontSize: 14, color: '#000', fontWeight: '700' },
  mapBtn: {
    backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12,
  },
  mapText: { color: '#FFF', fontWeight: '800', fontSize: 11 }
});