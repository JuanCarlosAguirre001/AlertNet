import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Importamos el navegador

export default function BottomMenu({ currentRoute }) {
  const router = useRouter(); // Inicializamos el router

  const menuItems = [
    { 
      name: 'Pánico', 
      icon: 'alert-circle-outline', 
      activeIcon: 'alert-circle', 
      route: 'panic' // Debe coincidir con app/panic.js
    },
    { 
      name: 'Contactos', 
      icon: 'people-outline', 
      activeIcon: 'people', 
      route: 'contacts' // Debe coincidir con app/contacts.js
    },
    { 
      name: 'Ajustes', 
      icon: 'settings-outline', 
      activeIcon: 'settings', 
      route: 'settings' // Debe coincidir con app/settings.js
    },
  ];

  const handleNavigation = (route) => {
    // Esto realiza la navegación física a la pantalla
    router.push(`/${route}`);
  };

  return (
    <View style={styles.container}>
      {menuItems.map((item) => {
        const isActive = currentRoute === item.route;
        const iconName = isActive ? item.activeIcon : item.icon;
        const color = isActive ? '#B42424' : '#757575'; 

        return (
          <TouchableOpacity 
            key={item.route} 
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => handleNavigation(item.route)} // Ahora navega de verdad
          >
            <Ionicons name={iconName} size={28} color={color} />
            <Text style={[styles.menuText, { color, fontWeight: isActive ? '900' : '600' }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 90, 
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%', 
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20, 
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  menuText: {
    fontSize: 12,
    marginTop: 5,
    letterSpacing: 0.3,
  },
});