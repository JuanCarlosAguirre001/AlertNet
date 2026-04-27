import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function Header({ showBack = true }) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* Flecha */}
      {showBack && (
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} color="black" />
  </TouchableOpacity>
)}

      {/* Texto con gradiente */}
      <MaskedView
        maskElement={
          <Text style={styles.logo}>
            AlertNet
          </Text>
        }
      >
        <LinearGradient
          colors={["#4A1414", "#B42424"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.logo, { opacity: 0 }]}>
            AlertNet
          </Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
    marginTop:60,      // Espacio justo para que no toque la cámara (notch)
    height: 30,         // Altura fija bajita
    marginBottom: 5,
    gap: 20,
    
  },

  logo: {
    fontSize: 25,
    fontWeight: "bold",
  },
});