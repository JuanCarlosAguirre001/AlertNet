import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Componentes reutilizados
import Background from "../src/components/Background";
import Header from "../src/components/Header";

export default function LoginEmail() {
  const router = useRouter();

  return (
    <Background>
      <View style={styles.safeContainer}>
        
        {/* Header mantiene el logo/nombre arriba a la izquierda */}
        <Header />

        <View style={styles.content}>
          <Text style={styles.mainTitle}>Iniciar Sesión</Text>

          {/* CONTENEDOR TRASLÚCIDO (Card) */}
          <View style={styles.card}>
            
            {/* INPUT CORREO */}
            <View style={styles.inputContainer}>
              <TextInput 
                placeholder="Correo" 
                placeholderTextColor="#949494"
                style={styles.input}
              />
            </View>

            {/* INPUT CONTRASEÑA */}
            <View style={styles.inputContainer}>
              <TextInput 
                placeholder="Contraseña" 
                placeholderTextColor="#949494"
                secureTextEntry={true}
                style={styles.input}
              />
              <TouchableOpacity>
                <Ionicons name="eye" size={24} color="#CCC" />
              </TouchableOpacity>
            </View>

            {/* OLVIDASTE CONTRASEÑA */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* BOTÓN INICIAR SESIÓN CON GRADIENTE */}
            <TouchableOpacity 
              style={styles.buttonWrapper}
              onPress={() => router.push("/contacts")}
            >
              <LinearGradient
                colors={['#4A1414', '#B42424']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* DIVISOR CREAR CUENTA */}
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.dividerText}>CREAR CUENTA</Text>
              </TouchableOpacity>
              <View style={styles.line} />
            </View>

          </View>
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
    paddingTop: 50,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#000',
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fondo sutil traslúcido
    width: '90%',
    padding: 25,
    borderRadius: 35,
    alignItems: 'center',
    paddingVertical: 40,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Inputs más claros
    width: '100%',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFF', // Texto dentro del input blanco según imagen
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
    marginRight: 10,
  },
  forgotText: {
    fontSize: 12,
    color: '#4A1414',
    fontWeight: '700',
  },
  buttonWrapper: {
    width: '80%',
    marginBottom: 35,
  },
  gradientButton: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#999',
    opacity: 0.4,
  },
  dividerText: {
    fontSize: 11,
    color: '#FFF',
    marginHorizontal: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});