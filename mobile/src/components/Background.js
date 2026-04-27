import React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Background({ children }) {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#743B3B"]} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.inner}>
          {children}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 25,
    // Eliminamos el paddingVertical fijo para que use el espacio del celular correctamente
    paddingTop: 20, 
  },
});