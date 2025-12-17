import React from "react";
import { Drawer } from "expo-router/drawer";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";


function CustomDrawerContent(props: DrawerContentComponentProps) {
  const handleLogout = () => {
    Alert.alert(
      "Keluar dari akun?",
      "Apakah kamu yakin ingin logout?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear(); // bersihkan data login
            router.replace("/login"); // kembali ke halaman login
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logoh.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>PERPUSAN</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuWrapper}>
        <DrawerItemList {...props} />
      </View>

      {/* Footer Logout */}
      <View style={styles.footer}>
        <View style={styles.divider} />

        <TouchableOpacity style={styles.footerItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#281A14" />
          <Text style={styles.footerText}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}


export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={drawerScreenOptions}
    >
      {drawerScreens.map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            drawerIcon: ({ color, size }) => (
              <Ionicons name={screen.icon as any} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Drawer>
  );
}


const drawerScreens = [
  { name: "index", title: "Koleksi Buku", icon: "book" },
  { name: "favorite", title: "Favorite", icon: "heart" },
  { name: "riwayat", title: "Riwayat", icon: "time" },
  { name: "panduan", title: "Panduan", icon: "map" },
];

const drawerScreenOptions = {
  headerShown: true,
  drawerType: "front",

  drawerActiveTintColor: "#281A14",
  drawerInactiveTintColor: "#281A14",

  drawerActiveBackgroundColor: "#F5F5F5",
  drawerInactiveBackgroundColor: "transparent",

  drawerStyle: {
    backgroundColor: "#FFFFFF",
    width: 280,
  },

  drawerLabelStyle: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    marginLeft: 12,
  },

  drawerItemStyle: {
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 4,
    paddingVertical: 8,
  },

  headerStyle: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  headerTintColor: "#281A14",
  headerTitleStyle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
  },
};


const styles = StyleSheet.create({
  scrollView: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },

  logo: { width: 50, height: 50, marginRight: 12 },

  title: {
    fontSize: 24,
    color: "#281A14",
    fontFamily: "Nunito_600SemiBold",
    letterSpacing: 1,
  },

  menuWrapper: { flex: 1, paddingTop: 10 },

  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginBottom: 12,
  },

  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
  },

  footerText: {
    fontSize: 16,
    color: "#281A14",
    marginLeft: 14,
    fontFamily: "Nunito_600SemiBold",
  },
});
