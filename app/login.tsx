import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [nipd, setNipd] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!nipd.trim() || !password.trim()) {
      return Alert.alert("Perhatian", "NIPD dan Password wajib diisi!");
    }

    if (nipd === "123" && password === "321") {
      await AsyncStorage.setItem("userLogin", "true");
      router.replace("/(tabs)");
    } else {
      Alert.alert("Gagal", "NIPD atau Password salah!");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/image.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <BlurView intensity={60} tint="dark" style={styles.blurOverlay} />

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>LOG IN</Text>
          </View>

          {/* Logo */}
          <View style={styles.brandSection}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>

            {/* Input NIPD */}
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#281A14" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan NIPD"
                placeholderTextColor="#281A1480"
                value={nipd}
                onChangeText={setNipd}
                keyboardType="numeric"
              />
            </View>

            {/* Input Password */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#281A14" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan Password"
                placeholderTextColor="#281A1480"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(prev => !prev)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#281A14"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </TouchableOpacity>

            {/* Button Login */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Masuk</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

// Styles (tidak diubah)
const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
    marginRight: 40,
    fontFamily: "Nunito_600SemiBold",
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  inputWrapper: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#8B6F47",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
    height: 54,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    color: "#281A14",
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
  },
  eyeIcon: { padding: 5 },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: 4,
  },
  forgotText: {
    color: "#281A14",
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
  },
  loginButton: {
    backgroundColor: "#281A14",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#281A14",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
  },
});
