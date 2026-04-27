import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Alert} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import Background from "../src/components/Background";
import Header from "../src/components/Header";
import BottomMenu from "../src/components/BottomMenu";
import NotificationBell from "../src/components/NotificationBell";

import { alertaService } from "../services/alertaService";
import { contactService } from "../services/contactService";

export default function AlertActiveScreen() {
  const router = useRouter();
  const { alertaId, direccion, latitud, longitud } = useLocalSearchParams();
  const [seconds, setSeconds] = useState(0);
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    cargarContactos();

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const cargarContactos = async () => {
    try {
      const data = await contactService.getContactos();
      setContactos(data);
    } catch (error) {
      console.log("ERROR CARGANDO CONTACTOS ALERTA:", error);
    }
  };

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleDeactivate = async () => {
    try {
      if (alertaId) {
        await alertaService.finalizarAlerta(alertaId);
      }

      Alert.alert("Alerta finalizada", "Tu alerta fue desactivada correctamente.");
      router.replace("/panic");
    } catch (error) {
      console.log("ERROR FINALIZANDO ALERTA:", error);
      Alert.alert("Error", "No se pudo finalizar la alerta.");
    }
  };

  return (
    <Background>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.mainContainer}>
        <Header />
        <NotificationBell />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.alertCircle}>
            <Ionicons name="checkmark" size={58} color="#fff" />
          </View>

          <Text style={styles.title}>ALERTA ENVIADA</Text>

          <Text style={styles.subtitle}>
            Tu ubicación fue compartida con tus contactos de confianza.
          </Text>

          <View style={styles.timerCard}>
            <Text style={styles.timerLabel}>TIEMPO TRANSCURRIDO</Text>
            <Text style={styles.timerText}>{formatTime(seconds)}</Text>
            <Text style={styles.timerHint}>
              La ubicación se compartirá por un máximo de 2 horas.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="location" size={24} color="#B42424" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Ubicación compartida</Text>
              <Text style={styles.infoText}>
              {direccion || "Ubicación actual compartida"}
            </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>CONTACTOS NOTIFICADOS</Text>

          {contactos.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No tienes contactos notificados.
              </Text>
            </View>
          ) : (
            contactos.map((contacto) => (
              <View key={contacto.id} style={styles.contactCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(contacto.nombre_contacto || "C").charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>
                    {contacto.nombre_contacto}
                  </Text>
                  <Text style={styles.contactPhone}>
                    {contacto.telefono_contacto}
                  </Text>
                </View>

                <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
              </View>
            ))
          )}

          <TouchableOpacity style={styles.deactivateButton} onPress={handleDeactivate}>
            <Ionicons name="close-circle-outline" size={22} color="#fff" />
            <Text style={styles.deactivateText}>DESACTIVAR ALERTA</Text>
          </TouchableOpacity>

          <View style={{ height: 110 }} />
        </ScrollView>

        <BottomMenu currentRoute="panic" />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    alignItems: "center",
  },
  alertCircle: {
    width: 115,
    height: 115,
    borderRadius: 58,
    backgroundColor: "#B42424",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "rgba(255,255,255,0.9)",
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 20,
  },
  timerCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 25,
    padding: 22,
    alignItems: "center",
    marginBottom: 16,
  },
  timerLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#894949",
    marginBottom: 8,
    letterSpacing: 1,
  },
  timerText: {
    fontSize: 38,
    fontWeight: "900",
    color: "#B42424",
  },
  timerHint: {
    fontSize: 12,
    color: "#555",
    marginTop: 8,
    textAlign: "center",
  },
  infoCard: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 22,
    padding: 16,
    alignItems: "center",
    marginBottom: 22,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FBE9E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111",
  },
  infoText: {
    fontSize: 13,
    color: "#555",
    marginTop: 3,
  },
  sectionTitle: {
    width: "100%",
    fontSize: 12,
    fontWeight: "900",
    color: "#894949",
    marginBottom: 12,
  },
  emptyCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 16,
    borderRadius: 18,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    fontWeight: "700",
  },
  contactCard: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#894949",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111",
  },
  contactPhone: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  deactivateButton: {
    marginTop: 18,
    width: "90%",
    height: 58,
    borderRadius: 30,
    backgroundColor: "#4A1414",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  deactivateText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
});