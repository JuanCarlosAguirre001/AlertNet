import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Background from "../src/components/Background";

export default function Index() {
  const router = useRouter();

  return (
    <Background>
      <View style={styles.container}>

        {/* CENTRO: LOGO Y TÍTULOS */}
        <View style={styles.centerContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>AlertNet</Text>
          
          <Text style={styles.subtitle}>
            TU SEGURIDAD EN UN SOLO TOQUE
          </Text>
        </View>

        {/* BOTONES PRINCIPALES */}
        <View style={styles.buttonContainer}>
          
          <TouchableOpacity onPress={() => router.push("/login")}>
            <LinearGradient
              colors={['#741D1D', '#B42424']} // Gradiente del botón iniciar sesión
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>INICIAR SESIÓN</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerText}>CREAR NUEVA CUENTA</Text>
          </TouchableOpacity>

        </View>

        {/* FOOTER: TÉRMINOS Y CONDICIONES */}
        <View style={styles.footerContainer}>
          <Text style={styles.footer}>
            Al continuar, aceptas nuestros{" "}
            <Text style={styles.link}>Términos de Servicio</Text>
            {" "}y la{" "}
            <Text style={styles.link}>Política de Privacidad.</Text>
          </Text>
        </View>

      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  centerContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#531a1a', // Color oscuro según la imagen
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#000',
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: 1.5,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 20,
  },
  loginButton: {
    width: 260,
    height: 60,
    borderRadius: 30, // Bordes muy redondeados como la imagen
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  registerText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
    marginTop: 10,
  },
  footerContainer: {
    paddingHorizontal: 40,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#4A1414',
    lineHeight: 16,
  },
  link: {
    color: '#530d0d',
    fontWeight: 'bold',
  },
});