import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// componentes
import Background from "../src/components/Background";
import Header from "../src/components/Header";
import BottomMenu from "../src/components/BottomMenu";
import ContactItem from "../src/components/ContactItem";
import NotificationBell from "../src/components/NotificationBell";
import AddContactModal from "../src/components/AddContactModal"; // IMPORTANTE: Agregamos el modal

export default function ContactsScreen() {
  const router = useRouter();
  
  // ESTADOS
  const [modalVisible, setModalVisible] = useState(false);
  const [listaContactos, setListaContactos] = useState([
    { id: 1, name: 'Mamá', phone: '+591 71234567', color: '#894949' },
    { id: 2, name: 'Carlos Ruiz', phone: '+591 71234567', color: '#894949' },
    { id: 3, name: 'Sofía - Vecina', phone: '+591 68345322', color: '#894949' },
  ]);

  // FUNCIÓN PARA GUARDAR (Luego conectaremos con el Service)
  const handleAddContact = (newContact) => {
    const nuevoId = listaContactos.length + 1;
    const contactoCompleto = { ...newContact, id: nuevoId, color: '#894949' };
    
    // Actualizamos la lista local (esto es el mock)
    setListaContactos([...listaContactos, contactoCompleto]);
    console.log("Contacto agregado localmente:", contactoCompleto);
  };

  return (
    <Background>
      <View style={styles.mainContainer}>
        
        <Header />
        <NotificationBell />

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.mainTitle}>Contactos de{"\n"}Confianza</Text>
          
          {/* Banner de Información Azul */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={22} color="#4f749c" />
            <Text style={styles.infoText}>
              Estos contactos recibirán tu ubicación en caso de emergencia
            </Text>
          </View>

          {/* Mapeo de Contactos */}
          {listaContactos.map((contact) => (
            <ContactItem 
                key={contact.id} 
                name={contact.name} 
                phone={contact.phone} 
                color={contact.color} 
            />
          ))}

          {/* Tarjeta de Agregar Contacto - Al presionar abre el Modal */}
          <TouchableOpacity 
            style={styles.addCard} 
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg' }} 
              style={styles.addCardImage}
            />
            <View style={styles.addCardOverlay}>
              <Text style={styles.addCardText}>AGREGA UN NUEVO CONTACTO</Text>
              <View style={styles.plusIcon}>
                <Ionicons name="add" size={28} color="white" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Espacio final */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* COMPONENTE MODAL (Oculto por defecto) */}
        <AddContactModal 
          visible={modalVisible} 
          onClose={() => setModalVisible(false)} 
          onSave={handleAddContact}
        />

        {/* Menú inferior fijo */}
        <BottomMenu currentRoute="contacts" />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#000',
    marginBottom: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    marginBottom: 25,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0056b3',
    fontWeight: '600',
    lineHeight: 18,
  },
  addCard: {
    height: 130,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  addCardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    padding: 20,
    justifyContent: 'flex-end',
  },
  addCardText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    width: '70%',
  },
  plusIcon: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4A1414',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  }
});