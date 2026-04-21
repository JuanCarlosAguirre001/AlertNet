import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NotificationBell({ hasNotifications = false }) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.7}
      onPress={() => router.push('/notifications')}
    >
      <Ionicons name="notifications-outline" size={24} color="#333" />
      
      {/* LÓGICA REAL: Solo se renderiza si hay notificaciones */}
      {hasNotifications && (
        <View style={styles.badge} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20, 
    top: 60, 
    zIndex: 10,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#B42424',
    borderWidth: 2,
    borderColor: 'white',
  },
});