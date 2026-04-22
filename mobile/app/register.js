import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Componentes reutilizados
import Background from "../src/components/Background";
import Header from "../src/components/Header";

// Service
import { authService } from "../services/authService";

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombreCompleto.trim() || !correo.trim() || !telefono.trim() || !password.trim()) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const userData = {
        nombre_completo: nombreCompleto.trim(),
        correo: correo.trim().toLowerCase(),
        telefono: telefono.trim(),
        password: password.trim(),
      };

      const response = await authService.register(userData);
      console.log("RESPUESTA REGISTER:", response);

      const usuarioGuardado = await authService.getCurrentUser();
      console.log("USUARIO JUSTO ANTES DE NAVEGAR:", usuarioGuardado);

      if (!usuarioGuardado) {
        Alert.alert("Error", "No se pudo guardar la sesión del usuario.");
        return;
      }

      Alert.alert("Éxito", "Cuenta creada correctamente.");
      router.replace("/contacts");
    } catch (error) {
      console.log("ERROR REGISTER SCREEN:", error);

      if (error?.email) {
        Alert.alert("Error", Array.isArray(error.email) ? error.email[0] : String(error.email));
      } else if (error?.telefono) {
        Alert.alert("Error", Array.isArray(error.telefono) ? error.telefono[0] : String(error.telefono));
      } else if (error?.nombre_completo) {
        Alert.alert("Error", Array.isArray(error.nombre_completo) ? error.nombre_completo[0] : String(error.nombre_completo));
      } else if (error?.password) {
        Alert.alert("Error", Array.isArray(error.password) ? error.password[0] : String(error.password));
      } else {
        Alert.alert("Error", "No se pudo crear la cuenta.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <View style={styles.safeContainer}>
        <Header />

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.mainTitle}>Crear Cuenta</Text>

            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Nombre completo"
                  placeholderTextColor="#949494"
                  style={styles.input}
                  value={nombreCompleto}
                  onChangeText={setNombreCompleto}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Correo"
                  placeholderTextColor="#949494"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  value={correo}
                  onChangeText={setCorreo}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Teléfono"
                  placeholderTextColor="#949494"
                  keyboardType="phone-pad"
                  style={styles.input}
                  value={telefono}
                  onChangeText={setTelefono}
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
                    color="#949494"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleRegister}
              disabled={loading}
            >
              <LinearGradient
                colors={['#4A1414', '#B42424']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>
                  {loading ? "CREANDO..." : "CREAR CUENTA"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#000',
    marginBottom: 50,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    width: '90%',
    paddingHorizontal: 20,
    paddingVertical: 35,
    borderRadius: 35,
    gap: 15,
    marginBottom: 60,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
    elevation: 8,
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