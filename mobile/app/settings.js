import React, { useEffect, useState } from 'react';
import {View,Text,StyleSheet,Image,ScrollView,TouchableOpacity,Alert,TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Background from "../src/components/Background";
import Header from "../src/components/Header";
import BottomMenu from "../src/components/BottomMenu";
import SettingCard from "../src/components/SettingCard";
import NotificationBell from "../src/components/NotificationBell";

import { settingsService } from "../services/settingsService";
import { authService } from "../services/authService";

export default function SettingsScreen() {
  const router = useRouter();

  const [volumenActive, setVolumenActive] = useState(true);
  const [notifActive, setNotifActive] = useState(false);
  const [locationActive, setLocationActive] = useState(true);
  const [usarMensaje, setUsarMensaje] = useState(true);

  const [mensaje, setMensaje] = useState("¡Ayuda! Estoy en una situación de emergencia en mi ubicación actual...");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const user = await authService.getCurrentUser();
      setUsuario(user);

      const data = await settingsService.getConfiguracion();
      console.log("CONFIG OBTENIDA:", data);

      setVolumenActive(data.boton_volumen);
      setNotifActive(data.notif_instantanea);
      setLocationActive(data.compartir_tiempo_real);
      setMensaje(data.mensaje_predeterminado);
      setUsarMensaje(data.usar_mensaje_personalizado ?? true);
    } catch (error) {
      console.log("ERROR CARGANDO CONFIG:", error);
      Alert.alert("Error", "No se pudo cargar la configuración.");
    }
  };

  const guardarConfiguracion = async (nuevaConfig) => {
    try {
      const data = await settingsService.updateConfiguracion(nuevaConfig);
      console.log("CONFIG GUARDADA:", data);
    } catch (error) {
      console.log("ERROR GUARDANDO CONFIG:", error);
      Alert.alert("Error", "No se pudo guardar la configuración.");
    }
  };

  const cerrarSesion = async () => {
    await authService.clearCurrentUser();
    router.replace("/login");
  };

  return (
    <Background>
      <View style={styles.mainContainer}>
        <Header />
        <NotificationBell />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editIcon}>
                <Ionicons name="pencil" size={14} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>
              {usuario?.nombre_completo || "Usuario"}
            </Text>

            <Text style={styles.userPhone}>
              {usuario?.correo || ""}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>CONFIGURACIÓN DE EMERGENCIA</Text>

          <SettingCard
            icon="volume-high"
            title="Activar con botón de volumen"
            subtitle="Presiona 3 veces para alerta"
            isActive={volumenActive}
            onToggle={async (value) => {
              setVolumenActive(value);
              await guardarConfiguracion({ boton_volumen: value });
            }}
          />

          <SettingCard
            icon="chatbubble-ellipses"
            title="Notificación instantánea"
            subtitle="Envío prioritario sin demoras"
            isActive={notifActive}
            onToggle={async (value) => {
              setNotifActive(value);
              await guardarConfiguracion({ notif_instantanea: value });
            }}
          />

          <SettingCard
            icon="location"
            title="Compartir ubicación en tiempo real"
            subtitle="Solo durante emergencias activas"
            isActive={locationActive}
            onToggle={async (value) => {
              setLocationActive(value);
              await guardarConfiguracion({ compartir_tiempo_real: value });
            }}
          />

          <Text style={styles.sectionTitle}>MENSAJE DE EMERGENCIA</Text>

          <SettingCard
            icon="chatbubble"
            title="Enviar mensaje de emergencia"
            subtitle="Si se desactiva, solo se compartirá la ubicación"
            isActive={usarMensaje}
            onToggle={async (value) => {
              setUsarMensaje(value);
              await guardarConfiguracion({ usar_mensaje_personalizado: value });
            }}
          />

          <View style={styles.messageCard}>
            <TextInput
              style={[
                styles.messageInput,
                !usarMensaje && styles.messageInputDisabled
              ]}
              value={mensaje}
              editable={usarMensaje}
              onChangeText={(text) => {
                if (text.length <= 100) {
                  setMensaje(text);
                }
              }}
              multiline
              maxLength={100}
              placeholder="Escribe tu mensaje de emergencia"
              placeholderTextColor="#777"
            />

            {!usarMensaje && (
              <Text style={styles.disabledMessageText}>
                El mensaje está desactivado. Solo se enviará la ubicación.
              </Text>
            )}

            <Text style={styles.counterText}>{mensaje.length}/100</Text>

            <TouchableOpacity
              disabled={!usarMensaje}
              onPress={async () => {
                if (!mensaje.trim()) {
                  Alert.alert("Error", "El mensaje no puede estar vacío.");
                  return;
                }

                await guardarConfiguracion({
                  mensaje_predeterminado: mensaje.trim(),
                  usar_mensaje_personalizado: usarMensaje
                });

                Alert.alert("Éxito", "Mensaje actualizado correctamente.");
              }}
            >
              <Text style={[
                styles.editMessageLink,
                !usarMensaje && styles.editMessageDisabled
              ]}>
                💾 Guardar Mensaje
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
            <Ionicons name="log-out-outline" size={20} color="#B42424" style={{ marginRight: 10 }} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomMenu currentRoute="settings" />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 15, paddingTop: 10 },
  profileSection: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'white' },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#B42424',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white'
  },
  userName: { fontSize: 20, fontWeight: '900', color: '#333' },
  userPhone: { fontSize: 14, color: '#666', marginTop: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '900', color: '#894949', marginBottom: 15, marginTop: 10 },

  messageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 15,
    borderRadius: 20,
    marginBottom: 25
  },
  messageInput: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  messageInputDisabled: {
    color: '#999',
    opacity: 0.7,
  },
  disabledMessageText: {
    fontSize: 11,
    color: '#777',
    marginBottom: 8,
  },
  counterText: {
    fontSize: 11,
    color: '#777',
    textAlign: 'right',
    marginBottom: 8,
  },
  editMessageLink: {
    fontSize: 11,
    color: '#894949',
    fontWeight: '800',
    textAlign: 'right'
  },
  editMessageDisabled: {
    color: '#aaa',
  },

  logoutButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  logoutText: { color: '#B42424', fontWeight: '900', fontSize: 16 },
});