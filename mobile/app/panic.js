import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import * as Location from "expo-location";

import { alertaService } from "../services/alertaService";
import { authService } from "../services/authService";
import { settingsService } from "../services/settingsService";
import { ubicacionService } from "../services/ubicacionService";
import { notificacionService } from "../services/notificacionService";
import { contactService } from "../services/contactService";

import Background from "../src/components/Background";
import Header from "../src/components/Header";
import BottomMenu from "../src/components/BottomMenu";
import NotificationBell from "../src/components/NotificationBell";

const { width } = Dimensions.get("window");

export default function PanicScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const [ubicacion, setUbicacion] = useState(null);
  const [direccion, setDireccion] = useState("Obteniendo ubicación...");

  const obtenerUbicacion = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setDireccion("Permiso de ubicación denegado");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitud: location.coords.latitude,
        longitud: location.coords.longitude,
      };

      setUbicacion(coords);

      const reverse = await Location.reverseGeocodeAsync({
        latitude: coords.latitud,
        longitude: coords.longitud,
      });

      if (reverse.length > 0) {
        const place = reverse[0];

        const textoDireccion = [
          place.street,
          place.district,
          place.city,
          place.region,
          place.country,
        ]
          .filter(Boolean)
          .join(", ");

        setDireccion(textoDireccion || "Ubicación actual detectada");
      } else {
        setDireccion("Ubicación actual detectada");
      }
    } catch (error) {
      console.log("ERROR UBICACIÓN:", error);
      setDireccion("No se pudo obtener la ubicación");
    }
  };

  useEffect(() => {
    obtenerUbicacion();

    pulseAnim.setValue(0);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.6],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.8, 0.35, 0],
  });

  const obtenerIdUsuario = (usuario) => {
    return usuario?.id || usuario?.usuario_id || usuario?.id_usuario || usuario?.pk;
  };

  const handleSendAlert = async () => {
    try {
      const usuario = await authService.getCurrentUser();
      console.log("USUARIO LOGUEADO:", usuario);

      if (!usuario) {
        Alert.alert("Error", "No hay usuario logueado");
        return;
      }

      const usuarioId = obtenerIdUsuario(usuario);

      if (!usuarioId) {
        console.log("USUARIO SIN ID:", usuario);
        Alert.alert("Error", "El usuario no tiene ID.");
        return;
      }

      if (!ubicacion?.latitud || !ubicacion?.longitud) {
        Alert.alert("Espera", "Todavía no se obtuvo la ubicación");
        return;
      }

      const dataUbicacion = {
        latitud: Number(ubicacion.latitud).toFixed(7),
        longitud: Number(ubicacion.longitud).toFixed(7),
        direccion: direccion || "Ubicación actual",
        usuario: usuarioId,
      };

      console.log("ENVIANDO UBICACIÓN:", dataUbicacion);

      const ubicacionGuardada = await ubicacionService.crearUbicacion(dataUbicacion);

      console.log("UBICACIÓN GUARDADA:", ubicacionGuardada);

      const config = await settingsService.getConfiguracion();

      let mensaje = "¡Ayuda! Estoy en una situación de emergencia en mi ubicación actual.";

      if (config?.usar_mensaje_personalizado && config?.mensaje_predeterminado) {
        mensaje = config.mensaje_predeterminado;
      }

      const alerta = await alertaService.crearAlerta({
        usuario_id: usuarioId,
        mensaje: mensaje,
      });

      console.log("ALERTA CREADA:", alerta);

      const contactos = await contactService.getContactos();

      if (contactos.length === 0) {
        Alert.alert(
          "Alerta creada",
          "Tu alerta fue creada, pero no tienes contactos registrados para notificar."
        );
      } else {
        for (let contacto of contactos) {
          const notificacion = await notificacionService.crearNotificacion({
            alerta: alerta.id,
            contacto: contacto.id,
            medio: "App",
            entregado: false,
          });

          console.log("NOTIFICACIÓN CREADA:", notificacion);
        }
      }

      router.push({
        pathname: "/alert-active",
        params: {
          alertaId: alerta.id,
          direccion: ubicacionGuardada.direccion,
          latitud: ubicacionGuardada.latitud,
          longitud: ubicacionGuardada.longitud,
        },
      });
    } catch (error) {
      console.log("ERROR ALERTA:", error);
      console.log("ERROR BACKEND:", error.response?.data);
      Alert.alert("Error", "Error al enviar alerta. Revisa la consola.");
    }
  };

  return (
    <Background>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.mainContainer}>
        <Header />
        <NotificationBell />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statusBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusText}>SISTEMA ACTIVO</Text>
          </View>

          <Text style={styles.title}>¿Necesitas ayuda?</Text>

          <View style={styles.instructionsContainer}>
            <View style={styles.instructionBanner}>
              <Ionicons name="finger-print" size={18} color="#4A1414" />
              <Text style={styles.instructionText}>
                Mantén presionado para activar la alerta.
              </Text>
            </View>

            <Text style={styles.subTextSmall}>
              También puedes activar la alerta presionando el botón de volumen 3 veces.
            </Text>
          </View>

          <View style={styles.panicContainer}>
            <Animated.View
              style={[
                styles.ringPulse,
                { transform: [{ scale }], opacity },
              ]}
            />

            <TouchableOpacity
              style={styles.panicButtonOuter}
              activeOpacity={0.9}
              onLongPress={handleSendAlert}
            >
              <View style={styles.panicButtonInner}>
                <Ionicons name="warning" size={46} color="white" />
                <Text style={styles.panicText}>ALERTA</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.locationCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={22} color="#B42424" />
            </View>

            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>ESTÁS EN</Text>
              <Text style={styles.locationAddress} numberOfLines={2}>
                {direccion}
              </Text>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        <BottomMenu currentRoute="panic" />
      </View>
    </Background>
  );
}

const buttonSize = width * 0.6;
const innerButtonSize = width * 0.48;
const pulseSize = width * 0.5;

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },

  content: {
    alignItems: "center",
    paddingHorizontal: 26,
    paddingTop: 10,
    paddingBottom: 120,
  },

  statusBadge: {
    flexDirection: "row",
    backgroundColor: "rgba(227,242,253,0.9)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },

  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1976D2",
    marginRight: 8,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#1976D2",
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
    marginBottom: 10,
  },

  instructionsContainer: {
    alignItems: "center",
    marginBottom: 10,
  },

  instructionBanner: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(180,36,36,0.08)",
    padding: 10,
    borderRadius: 15,
  },

  instructionText: {
    fontSize: 12,
    fontWeight: "700",
  },

  subTextSmall: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 5,
  },

  panicContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: width * 0.7,
  },

  ringPulse: {
    position: "absolute",
    width: pulseSize,
    height: pulseSize,
    borderRadius: pulseSize / 2,
    backgroundColor: "rgba(180,36,36,0.6)",
  },

  panicButtonOuter: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: "rgba(180,36,36,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  panicButtonInner: {
    width: innerButtonSize,
    height: innerButtonSize,
    borderRadius: innerButtonSize / 2,
    backgroundColor: "#B52C2C",
    justifyContent: "center",
    alignItems: "center",
  },

  panicText: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 6,
  },

  locationCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FBE9E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  locationInfo: { flex: 1 },

  locationLabel: {
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 3,
  },

  locationAddress: {
    fontSize: 12,
    fontWeight: "700",
  },
});