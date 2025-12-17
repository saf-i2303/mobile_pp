import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.6;

export default function FavoriteScreen() {
  const [books, setBooks] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);


  const loadFavorites = async () => {
    try {
      const json = await AsyncStorage.getItem("favorites");
      if (json) {
        setFavorites(new Set(JSON.parse(json)));
      }
    } catch (e) {
      console.log("Error load favorites:", e);
    }
  };

  const saveFavorites = async (favSet: Set<number>) => {
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify([...favSet]));
    } catch (e) {
      console.log("Error saving favorites:", e);
    }
  };

 
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("https://books-api-green.vercel.app/books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.log("Error fetch buku:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    loadFavorites();
  }, []);

 
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const toggleFavorite = (bookId: number) => {
    setFavorites((prev) => {
      const newFav = new Set(prev);

      if (newFav.has(bookId)) {
        newFav.delete(bookId);
        Alert.alert("Dihapus", "Buku dihapus dari favorit");
      } else {
        newFav.add(bookId);
        Alert.alert("Berhasil! ✨", "Buku berhasil ditambahkan ke favorit");
      }

      saveFavorites(newFav);
      return newFav;
    });
  };

  const favoriteBooks = useMemo(() => {
    return books.filter((b) => favorites.has(b.id));
  }, [books, favorites]);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B6F47" />
        <Text style={{ marginTop: 12, color: "#8B6F47" }}>Memuat buku...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buku Favorit </Text>
        <Text style={styles.headerSubtitle}>{favoriteBooks.length} buku tersimpan</Text>
      </View>

      {/* Empty State */}
      {favoriteBooks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={80} color="#D0C6BE" />
          <Text style={styles.emptyTitle}>Belum ada buku favorit</Text>
          <Text style={styles.emptySubtitle}>
            Tambahkan buku ke favorit dengan menekan icon hati di kartu buku
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteBooks}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <BookCard
              item={item}
              isFavorite={favorites.has(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

// ============================
// BOOK CARD COMPONENT
// (Identik dengan HomeScreen)
// ============================
const BookCard = ({ item, isFavorite, onToggleFavorite }: any) => {
  const rating = useMemo(() => (4.0 + Math.random()).toFixed(1), []);
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.bookCard, pressed && styles.bookCardPressed]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.95}
    >
      <View style={styles.coverContainer}>
        <Image source={{ uri: item.image }} style={styles.bookCover} />

        <View style={styles.gradientOverlay} />

        <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
          <View style={styles.favoriteButtonInner}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={16}
              color={isFavorite ? "#FF4757" : "#FFFFFF"}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.infoOverlay}>
          <Text style={styles.overlayTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.overlayAuthor}>{item.author}</Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingBadgeText}>{rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ============================
// STYLES (NO UI CHANGES)
// ============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: 50,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 24,
    color: "#281A14",
    fontFamily: "Nunito_800ExtraBold",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#8B6F47",
    fontFamily: "Nunito_600SemiBold",
    marginTop: 4,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 20,
    marginTop: 20,
    fontFamily: "Nunito_700Bold",
    color: "#281A14",
  },

  emptySubtitle: {
    fontSize: 14,
    marginTop: 6,
    color: "#8B6F47",
    fontFamily: "Nunito_600SemiBold",
    textAlign: "center",
  },

  gridContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },

  bookCard: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    elevation: 5,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  bookCardPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },

  coverContainer: {
    position: "relative",
    width: "100%",
    height: CARD_HEIGHT,
  },

  bookCover: {
    width: "100%",
    height: "100%",
  },

  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "35%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
  },

  favoriteButtonInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
  },

  infoOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },

  overlayTitle: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Nunito_800ExtraBold",
  },

  overlayAuthor: {
    color: "#DDD",
    fontSize: 11,
    marginTop: 2,
    fontFamily: "Nunito_600SemiBold",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
    width: 52,
  },

  ratingBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
  },
});
