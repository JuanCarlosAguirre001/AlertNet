import React, { useEffect, useState } from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Image,Alert,ActivityIndicator} from 'react-native';
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

      console.log("CONTACTOS DEL USUARIO:", data);
      setListaContactos(data);
    } catch (error) {
      console.log("ERROR CARGANDO CONTACTOS:", error);
      console.log("ERROR CARGANDO CONTACTOS STRING:", JSON.stringify(error, null, 2));

      if (error?.detail) {
        Alert.alert("Error", String(error.detail));
      } else if (error?.message) {
        Alert.alert("Error", String(error.message));
      } else if (error?.error) {
        Alert.alert("Error", String(error.error));
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

      if (!newContact.name || newContact.name.trim() === "") {
        Alert.alert("Error", "El nombre del contacto es obligatorio.");
        return;
      }

      if (!newContact.phone || newContact.phone.trim() === "") {
        Alert.alert("Error", "El teléfono del contacto es obligatorio.");
        return;
      }
      if (listaContactos.length >= 3) {
          Alert.alert(
            "Límite alcanzado",
            "Solo puedes agregar hasta 3 contactos en la versión gratuita. Mejora a Premium para agregar más contactos."
          );
          return;
        }

      const payload = {
        usuario_id: usuario.id,
        nombre_contacto: newContact.name.trim(),
        telefono_contacto: newContact.phone.trim(),
        prioridad: 1,
      };

      console.log("PAYLOAD ENVIADO NUEVO:", payload);

      await contactService.createContacto(payload);

      setModalVisible(false);
      Alert.alert("Éxito", "Contacto agregado correctamente.");
      await cargarContactos();
    } catch (error) {
      console.log("ERROR AL AGREGAR CONTACTO:", error);
      console.log("ERROR AL AGREGAR CONTACTO STRING:", JSON.stringify(error, null, 2));

      if (error?.nombre_contacto) {
        Alert.alert("Error", Array.isArray(error.nombre_contacto) ? error.nombre_contacto[0] : String(error.nombre_contacto));
      } else if (error?.telefono_contacto) {
        Alert.alert("Error", Array.isArray(error.telefono_contacto) ? error.telefono_contacto[0] : String(error.telefono_contacto));
      } else if (error?.usuario_id) {
        Alert.alert("Error", Array.isArray(error.usuario_id) ? error.usuario_id[0] : String(error.usuario_id));
      } else if (error?.error) {
        Alert.alert("Error", String(error.error));
      } else {
        Alert.alert("Error", "No se pudo guardar el contacto.");
      }
    }
  };

  const handleDeleteContact = async (contactId) => {
  try {
    console.log("CLICK ELIMINAR ID:", contactId);
    await contactService.deleteContacto(contactId);

    console.log("CONTACTO ELIMINADO CORRECTAMENTE");
    await cargarContactos();

    Alert.alert("Éxito", "Contacto eliminado correctamente.");
  } catch (error) {
    console.log("ERROR ELIMINANDO CONTACTO:", error);
    console.log("ERROR ELIMINANDO CONTACTO STRING:", JSON.stringify(error, null, 2));
    Alert.alert("Error", "No se pudo eliminar el contacto.");
  }
};

  return (
    <Background>
      <View style={styles.mainContainer}>
        <Header showBack={false} />
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
                    {(contact.nombre_contacto || "C").charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.nombre_contacto}</Text>
                  <Text style={styles.contactPhone}>{contact.telefono_contacto}</Text>
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