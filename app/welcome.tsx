import React, { useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";

export default function Welcome() {
  const [error, setError] = useState(false);

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={require("../assets/images/image.png")}
        onError={() => setError(true)}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Blur Overlay */}
        <BlurView intensity={50} tint="dark" style={styles.blurOverlay} />

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>PERPUSAN</Text>
            <Text style={styles.subtitle}>Perpustakaan Digital Sekolah</Text>
          </View>

          {/* Logo Section - Tengah */}
          <View style={styles.logoWrapper}>
            <Image 
              source={require("../assets/images/logo.png")} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Bottom Buttons */}
          <View style={styles.bottom}>
            <Text style={styles.taglineTitle}>Tunggu apalagi?</Text>
            <Text style={styles.tagakan}>
              Waktunya upgrade literasimu!
            </Text>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginBtn} onPress={() => router.push("/login")}>
              <Text style={styles.loginText}>Mulai Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, justifyContent: "center" },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  titleWrapper: {
    alignItems: "center",
    marginTop: 100,
  },
  title: {
    fontSize: 52,
    fontWeight: "800",
    color: "white",
    letterSpacing: 3,
    textShadowColor: "#8B4513",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    fontFamily: "Nunito_800ExtraBold",
    // Efek border glow coklat menggunakan multiple text shadows
    // Karena React Native tidak support multiple textShadow, kita gunakan radius besar
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    marginTop: 8,
    fontFamily: "Nunito_400Regular",
  },
  logoWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 150,
    height: 150,
    shadowColor: "#8B4513",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  bottom: {
    width: "100%",
    alignItems: "center",
    marginBottom: 120, // Diubah jadi 120 supaya lebih ke atas
  },
  taglineTitle: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    marginBottom: 12,
    fontFamily: "Nunito_700Bold",
    textShadowColor: "rgba(139, 69, 19, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
  tagakan: {
    color: "white",
    fontSize: 16,
    marginBottom: 30,
    fontFamily: "Nunito_600SemiBold",
    textAlign: "center",
    lineHeight: 24,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    paddingHorizontal: 20,
  },
  loginBtn: {
    backgroundColor: "white",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  loginText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Nunito_600SemiBold",
  },
});