import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import Background from "../src/components/Background";
import Header from "../src/components/Header";
import { authService } from "../services/authService";

export default function LoginEmail() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo.trim() || !password.trim()) {
      Alert.alert("Campos incompletos", "Por favor llena correo y contraseña.");
      return;
    }

    try {
      setLoading(true);

      const user = await authService.login(
        correo.trim().toLowerCase(),
        password.trim()
      );

      console.log("RESPUESTA LOGIN:", user);

      const usuarioGuardado = await authService.getCurrentUser();
      console.log("USUARIO JUSTO ANTES DE NAVEGAR LOGIN:", usuarioGuardado);

      if (!usuarioGuardado) {
        Alert.alert("Error", "No se pudo guardar la sesión del usuario.");
        return;
      }

      Alert.alert("Éxito", "Inicio de sesión correcto.");
      router.replace("/contacts");
    } catch (error) {
      console.log("ERROR LOGIN SCREEN:", error);

      if (error?.message) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "No se pudo iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <View style={styles.safeContainer}>
        <Header />

        <View style={styles.content}>
          <Text style={styles.mainTitle}>Iniciar Sesión</Text>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Correo"
                placeholderTextColor="#949494"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={correo}
                onChangeText={setCorreo}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#949494"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#CCC"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={['#4A1414', '#B42424']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>
                  {loading ? "INGRESANDO..." : "INICIAR SESIÓN"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: '90%',
    padding: 25,
    borderRadius: 35,
    alignItems: 'center',
    paddingVertical: 40,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    color: '#FFF',
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