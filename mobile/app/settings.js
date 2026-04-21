import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componentes 
import Background from "../src/components/Background";
import Header from "../src/components/Header";
import BottomMenu from "../src/components/BottomMenu";
import SettingCard from "../src/components/SettingCard";
import NotificationBell from "../src/components/NotificationBell";

export default function SettingsScreen() {
  const [volumenActive, setVolumenActive] = useState(true);
  const [notifActive, setNotifActive] = useState(false);
  const [locationActive, setLocationActive] = useState(true);

  return (
    <Background>
      <View style={styles.mainContainer}>
        <Header />
        <NotificationBell />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* PERFIL */}
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
            <Text style={styles.userName}>Alejandro Morales</Text>

          </View>

          {/* CONFIGURACIÓN DE EMERGENCIA */}
          <Text style={styles.sectionTitle}>CONFIGURACIÓN DE EMERGENCIA</Text>
          
          <SettingCard 
            icon="volume-high"
            title="Activar con botón de volumen"
            subtitle="Presiona 3 veces para alerta"
            isActive={volumenActive}
            onToggle={setVolumenActive}
          />

          <SettingCard 
            icon="chatbubble-ellipses"
            title="Notificación instantánea"
            subtitle="Envío prioritario sin demoras"
            isActive={notifActive}
            onToggle={setNotifActive}
          />

          <SettingCard 
            icon="location"
            title="Compartir ubicación en tiempo real"
            subtitle="Solo durante emergencias activas"
            isActive={locationActive}
            onToggle={setLocationActive}
          />

          {/* MENSAJE DE EMERGENCIA (Estructura especial) */}
          <Text style={styles.sectionTitle}>MENSAJE DE EMERGENCIA</Text>
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              ¡Ayuda! Estoy en una situación de emergencia en mi ubicación actual...
            </Text>
            <TouchableOpacity>
              <Text style={styles.editMessageLink}>✏️ Editar Mensaje</Text>
            </TouchableOpacity>
          </View>

          {/* BOTÓN CERRAR SESIÓN */}
          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#B42424" style={{marginRight: 10}} />
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
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#B42424', width: 28, height: 28,
    borderRadius: 14, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'white'
  },
  userName: { fontSize: 20, fontWeight: '900', color: '#333' },
  userPhone: { fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 12, fontWeight: '900', color: '#894949', marginBottom: 15, marginTop: 10 },
  
  messageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 15, borderRadius: 20, marginBottom: 25
  },
  messageText: { fontSize: 13, color: '#555', fontStyle: 'italic', marginBottom: 10 },
  editMessageLink: { fontSize: 11, color: '#894949', fontWeight: '800', textAlign: 'right' },
  
  logoutButton: {
    flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)'
  },
  logoutText: { color: '#B42424', fontWeight: '900', fontSize: 16 }
});