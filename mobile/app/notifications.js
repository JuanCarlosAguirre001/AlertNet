import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";

import Background from "../src/components/Background";
import Header from "../src/components/Header";
import BottomMenu from "../src/components/BottomMenu";

import { notificacionService, useNotificationSocket } from "../services/notificacionService";
import { authService } from "../services/authService";

export default function NotificationsScreen() {
  //const [notifications, setNotifications] = useState([]);
  const [usuario, setUsuario] = useState(null);
   useEffect(() => {
    const fetchUser = async () => {
      const u = await authService.getCurrentUser();
      setUsuario(u);
    };
    fetchUser();
  }, []);

    console.log("ID USUARIOSS",usuario?.id);
    const { notifications, setNotifications, isConnected } = useNotificationSocket(usuario?.id);
    console.log("NOTIFICACIONES EN EL COMPONENTE:", notifications);

  const marcarComoLeida = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, entregado: true } : item
      )
    );
  };

  const limpiarLeidas = () => {
    setNotifications((prev) => prev.filter((item) => !item.entregado));
  };
  if (!usuario) {
    return (
      <Background>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Cargando datos del usuario...</Text>
      </Background>
    );
  }
  return (
    <Background>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Header />

        <View style={styles.topRow}>
          <Text style={styles.title}>Notificaciones</Text>

          <TouchableOpacity style={styles.clearButton} onPress={limpiarLeidas}>
            <Text style={styles.clearText}>Limpiar leídas</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {notifications.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name="notifications-off-outline"
                size={42}
                color="#894949"
              />
              <Text style={styles.emptyTitle}>Sin notificaciones</Text>
              <Text style={styles.emptyText}>
                Aquí aparecerán las alertas y avisos importantes.
              </Text>
            </View>
          ) : (
            notifications.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  !item.entregado && styles.unreadCard,
                ]}
                onPress={() => marcarComoLeida(item.id)}
                activeOpacity={0.85}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="notifications"
                    size={24}
                    color="#B42424"
                  />
                </View>

                <View style={styles.content}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      Alerta enviada
                    </Text>

                    {!item.entregado && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.cardDesc}>
                    
                  {`id : ${item.id}`} {item.alerta.autor.nombre_completo} pide {item.alerta.mensaje } 
                  </Text>

                  <Text style={styles.time}>
                    Vía: {item.medio}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <BottomMenu currentRoute="notifications" />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#000",
  },
  clearButton: {
    backgroundColor: "rgba(255,255,255,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  clearText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#894949",
  },
  scroll: {
    paddingBottom: 120,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.55)",
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: "center",
  },
  unreadCard: {
    backgroundColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    borderColor: "rgba(180,36,36,0.18)",
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FBE9E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111",
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#B42424",
  },
  cardDesc: {
    fontSize: 12,
    color: "#555",
    marginTop: 3,
    lineHeight: 16,
  },
  time: {
    fontSize: 10,
    color: "#888",
    marginTop: 6,
    fontWeight: "700",
  },
  emptyCard: {
    marginTop: 80,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
});