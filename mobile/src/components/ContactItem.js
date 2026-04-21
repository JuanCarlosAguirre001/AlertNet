import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ContactItem({ name, phone, color }) {
  return (
    <View style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.avatarText}>{name.charAt(0)}</Text>
      </View>
      
      {/* Aquí corregimos el espacio de < View */}
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.phone}>{phone}</Text>
      </View>

      <TouchableOpacity style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={22} color="#4A1414" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: '100%',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 20 
  },
  info: { 
    flex: 1 
  },
  name: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  phone: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 2 
  },
  deleteBtn: { 
    padding: 5 
  },
});