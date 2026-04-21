import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Componentes reutilizados
import Background from "../src/components/Background";
import Header from "../src/components/Header";

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Background>
      <View style={styles.safeContainer}>
        
        {/* Header con la flecha y AlertNet */}
        <Header />

        <View style={styles.content}>
          <Text style={styles.mainTitle}>Crear Cuenta</Text>

          {/* CONTENEDOR TRASLÚCIDO (Card) */}
          <View style={styles.card}>
            
            {/* INPUT NOMBRE */}
            <View style={styles.inputContainer}>
              <TextInput 
                placeholder="Nombre" 
                placeholderTextColor="#49494"
                style={styles.input}
              />
            </View>

            {/* INPUT CORREO */}
            <View style={styles.inputContainer}>
              <TextInput 
                placeholder="Correo" 
                placeholderTextColor="#49494"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            {/* INPUT CONTRASEÑA */}
            <View style={styles.inputContainer}>
              <TextInput 
                placeholder="Contraseña" 
                placeholderTextColor="#49494"
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={24} 
                  color="#49494" 
                />
              </TouchableOpacity>
            </View>

          </View>

          {/* BOTÓN CREAR CUENTA CON GRADIENTE */}
          <TouchableOpacity 
            style={styles.buttonWrapper}
            onPress={() => router.push("/verify")} // O la ruta que desees
          >
            <LinearGradient
              colors={['#4A1414', '#B42424']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>CREAR CUENTA</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80, // Ajustado para centrar según la imagen
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#000',
    marginBottom: 50,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)', // Opacidad baja para el efecto cristal
    width: '90%',
    paddingHorizontal: 20,
    paddingVertical: 35,
    borderRadius: 35,
    gap: 15,
    marginBottom: 60,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Más claro que el fondo de la card
    width: '100%',
    height: 65,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  buttonWrapper: {
    width: '75%',
    height: 65,
  },
  gradientButton: {
    flex: 1,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Sombra más marcada como en la imagen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});