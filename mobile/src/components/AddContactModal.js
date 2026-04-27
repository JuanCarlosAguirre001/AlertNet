import React, { useState } from 'react';
import {Modal,View,Text,TextInput,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform,Alert,FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddContactModal({ visible, onClose, onSave }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showCountries, setShowCountries] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState({
    flag: "🇧🇴",
    code: "+591",
    name: "Bolivia",
  });

  const countries = [
    { flag: "🇧🇴", code: "+591", name: "Bolivia" },
    { flag: "🇦🇷", code: "+54", name: "Argentina" },
    { flag: "🇧🇷", code: "+55", name: "Brasil" },
    { flag: "🇨🇱", code: "+56", name: "Chile" },
    { flag: "🇵🇪", code: "+51", name: "Perú" },
    { flag: "🇺🇸", code: "+1", name: "Estados Unidos" },
  ];

  const handleSave = async () => {
    const cleanPhone = phone.replace(/\s/g, "");

    if (!name.trim() || !cleanPhone.trim()) {
      Alert.alert("Campos incompletos", "Por favor rellena nombre y teléfono.");
      return;
    }

    if (cleanPhone.startsWith("+")) {
      Alert.alert("Formato incorrecto", "Escribe solo el número, sin código de país.");
      return;
    }

    await onSave({
      name: name.trim(),
      phone: `${selectedCountry.code}${cleanPhone}`,
      email: email.trim(),
    });

    setName('');
    setPhone('');
    setEmail('');
    setSelectedCountry({ flag: "🇧🇴", code: "+591", name: "Bolivia" });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Nuevo Contacto</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Teléfono</Text>

            <View style={styles.phoneRow}>
              <TouchableOpacity
                style={styles.countrySelector}
                onPress={() => setShowCountries(!showCountries)}
                activeOpacity={0.8}
              >
                <Text style={styles.countrySelectorText}>
                  {selectedCountry.flag} {selectedCountry.code}
                </Text>
                <Ionicons
                  name={showCountries ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#333"
                />
              </TouchableOpacity>

              <TextInput
                style={styles.phoneInput}
                placeholder=""
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {showCountries && (
              <View style={styles.countryList}>
                <FlatList
                  data={countries}
                  keyExtractor={(item) => item.code}
                  nestedScrollEnabled
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.countryItem}
                      onPress={() => {
                        setSelectedCountry(item);
                        setShowCountries(false);
                      }}
                    >
                      <Text style={styles.countryItemText}>
                        {item.flag} {item.name}
                      </Text>
                      <Text style={styles.countryCodeText}>{item.code}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            <Text style={styles.label}>Correo (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar Contacto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    minHeight: 520,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#B42424',
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: -10,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countrySelector: {
    height: 52,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  countrySelectorText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    height: 52,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  countryList: {
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEE',
    maxHeight: 180,
    overflow: 'hidden',
    marginTop: -5,
  },
  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  countryItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B42424',
  },
  saveButton: {
    backgroundColor: '#B42424',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});