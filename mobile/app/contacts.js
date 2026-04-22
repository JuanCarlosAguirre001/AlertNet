import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Background from "../src/components/Background";
import Header from "../src/components/Header";
import BottomMenu from "../src/components/BottomMenu";
import NotificationBell from "../src/components/NotificationBell";
import AddContactModal from "../src/components/AddContactModal";

import { contactService } from "../services/contactService";
import { authService } from "../services/authService";

export default function ContactsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [listaContactos, setListaContactos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarContactos = async () => {
    try {
      setLoading(true);

      const usuario = await authService.getCurrentUser();
      console.log("USUARIO EN CONTACTOS:", usuario);

      if (!usuario) {
        Alert.alert("Error", "No se encontró un usuario logueado.");
        return;
      }

      const data = await contactService.getContactos();

      const contactosDelUsuario = data.filter(
        (contacto) =>
          String(contacto.usuario) === String(usuario.id_usuario || usuario.id)
      );

      console.log("CONTACTOS DEL USUARIO:", contactosDelUsuario);
      setListaContactos(contactosDelUsuario);
    } catch (error) {
      console.log("ERROR CARGANDO CONTACTOS:", error);
      console.log("ERROR CARGANDO CONTACTOS STRING:", JSON.stringify(error, null, 2));

      if (error?.detail) {
        Alert.alert("Error", String(error.detail));
      } else if (error?.message) {
        Alert.alert("Error", String(error.message));
      } else {
        Alert.alert("Error", "No se pudieron cargar los contactos.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarContactos();
  }, []);

  const handleAddContact = async (newContact) => {
    try {
      const usuario = await authService.getCurrentUser();
      console.log("USUARIO LOGUEADO:", usuario);
      console.log("CONTACTO NUEVO:", newContact);

      if (!usuario) {
        Alert.alert("Error", "No hay usuario logueado.");
        return;
      }

      const payload = {
        usuario: usuario.id_usuario || usuario.id,
        nombre: newContact.name,
        telefono: newContact.phone,
        email: newContact.email || "",
        es_principal: false,
      };

      console.log("PAYLOAD ENVIADO:", payload);

      await contactService.createContacto(payload);

      setModalVisible(false);
      Alert.alert("Éxito", "Contacto agregado correctamente.");
      await cargarContactos();
    } catch (error) {
      console.log("ERROR AL AGREGAR CONTACTO:", error);
      console.log("ERROR AL AGREGAR CONTACTO STRING:", JSON.stringify(error, null, 2));

      if (error?.usuario) {
        Alert.alert("Error", Array.isArray(error.usuario) ? error.usuario[0] : String(error.usuario));
      } else if (error?.nombre) {
        Alert.alert("Error", Array.isArray(error.nombre) ? error.nombre[0] : String(error.nombre));
      } else if (error?.telefono) {
        Alert.alert("Error", Array.isArray(error.telefono) ? error.telefono[0] : String(error.telefono));
      } else if (error?.email) {
        Alert.alert("Error", Array.isArray(error.email) ? error.email[0] : String(error.email));
      } else if (error?.detail) {
        Alert.alert("Error", String(error.detail));
      } else if (error?.message) {
        Alert.alert("Error", String(error.message));
      } else {
        Alert.alert("Error", "No se pudo guardar el contacto.");
      }
    }
  };

  const handleDeleteContact = (contactId) => {
    Alert.alert(
      "Eliminar contacto",
      "¿Seguro que deseas eliminar este contacto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await contactService.deleteContacto(contactId);
              await cargarContactos();
              Alert.alert("Éxito", "Contacto eliminado correctamente.");
            } catch (error) {
              console.log("ERROR ELIMINANDO CONTACTO:", error);
              Alert.alert("Error", "No se pudo eliminar el contacto.");
            }
          }
        }
      ]
    );
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

          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={22} color="#4f749c" />
            <Text style={styles.infoText}>
              Estos contactos recibirán tu ubicación en caso de emergencia
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#B42424" style={{ marginTop: 30 }} />
          ) : listaContactos.length === 0 ? (
            <Text style={styles.emptyText}>Aún no tienes contactos guardados.</Text>
          ) : (
            listaContactos.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {(contact.nombre || "C").charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.nombre}</Text>
                  <Text style={styles.contactPhone}>{contact.telefono}</Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteContact(contact.id)}
                >
                  <Ionicons name="trash-outline" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            ))
          )}

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

          <View style={{ height: 120 }} />
        </ScrollView>

        <AddContactModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleAddContact}
        />

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
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#894949',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 20,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111',
  },
  contactPhone: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
  deleteButton: {
    backgroundColor: '#B42424',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
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