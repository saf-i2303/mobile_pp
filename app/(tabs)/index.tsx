import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import BookCard from "@/components/books/bookCard";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const kategori = useMemo(
    () => ["Semua", "Fiksi Indonesia", "Filsafat Dunia", "Buku Pelajaran SMK"],
    []
  );


  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem("userLogin");
      if (!user) router.replace("/");
    })();
  }, []);

  
  const loadFavorites = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem("favorites");
      if (json) setFavorites(new Set(JSON.parse(json)));
    } catch {}
  }, []);

  const saveFavorites = useCallback(async (favSet: Set<number>) => {
    await AsyncStorage.setItem("favorites", JSON.stringify([...favSet]));
  }, []);

  const toggleFavorite = useCallback(
    (id: number) => {
      setFavorites((prev) => {
        const updated = new Set(prev);
        if (updated.has(id)) {
          updated.delete(id);
        } else {
          updated.add(id);
          Alert.alert("Berhasil ", "Ditambahkan ke favorit!");
        }
        saveFavorites(updated);
        return updated;
      });
    },
    [saveFavorites]
  );

 
  useEffect(() => {
    const controller = new AbortController();

    const getBooks = async () => {
      try {
        const res = await fetch("https://books-api-green.vercel.app/books", {
          signal: controller.signal,
        });

        const data = await res.json();
        setBooks(data);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        if (err instanceof Error) {
          console.log("Fetch gagal:", err.message);
        } else {
          console.log("Fetch gagal:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    getBooks();
    loadFavorites();

    return () => controller.abort();
  }, [loadFavorites]);


  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return books.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);

      const matchCategory =
        selectedKategori === "Semua" || b.category === selectedKategori;

      return matchSearch && matchCategory;
    });
  }, [books, searchQuery, selectedKategori]);

  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B6F47" />
        <Text style={{ marginTop: 12, color: "#8B6F47" }}>
          Memuat buku...
        </Text>
      </View>
    );
  }

 
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setDropdownOpen(false);
      }}
    >
      <View style={styles.container}>
        {/* TITLE */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Ayo temukan bukumu!</Text>
          <Text style={styles.welcomeSubtitle}>
            Jelajahi ribuan koleksi buku pilihan
          </Text>
        </View>

        {/* SEARCH + FILTER */}
        <View style={styles.topBar}>
          {/* Search */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#8B6F47" />

            <TextInput
              placeholder="Cari judul atau penulis..."
              placeholderTextColor="#A89384"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#8B6F47" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setDropdownOpen((p) => !p)}
            >
              <Ionicons name="filter" size={20} color="#281A14" />
            </TouchableOpacity>

            {dropdownOpen && (
              <View style={styles.dropdownMenu}>
                {kategori.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.dropdownItem,
                      selectedKategori === cat && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSelectedKategori(cat);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        selectedKategori === cat &&
                          styles.dropdownTextActive,
                      ]}
                    >
                      {cat}
                    </Text>

                    {selectedKategori === cat && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color="#281A14"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* INFO */}
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            {filteredBooks.length} buku{" "}
            {favorites.size > 0 && (
              <Text style={styles.favoriteInfo}>
                • {favorites.size} favorit
              </Text>
            )}
          </Text>
        </View>

        {/* EMPTY RESULT */}
        {filteredBooks.length === 0 && (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Ionicons name="book-outline" size={60} color="#A89384" />
            <Text style={{ color: "#8B6F47", marginTop: 10 }}>
              Tidak ada buku ditemukan
            </Text>
          </View>
        )}

        {/* GRID */}
        <FlatList
          data={filteredBooks}
          keyExtractor={(i) => i.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookCard
              item={item}
              isFavorite={favorites.has(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onPressCard={() => router.push(`/book/${item.id}`)}
            />
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", paddingTop: 50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcomeSection: { paddingHorizontal: 20, marginBottom: 20 },
  welcomeTitle: { fontSize: 24, color: "#281A14", marginBottom: 4 },
  welcomeSubtitle: { fontSize: 14, color: "#8B6F47" },
  topBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 12,
    alignItems: "center",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#281A14" },
  dropdownWrapper: { position: "relative" },
  dropdownButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    position: "absolute",
    top: 55,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    width: 160,
    paddingVertical: 8,
    elevation: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemActive: { backgroundColor: "#FFF9F5" },
  dropdownText: { fontSize: 14, color: "#281A14" },
  dropdownTextActive: { color: "#8B6F47", fontWeight: "bold" },
  infoBar: { paddingHorizontal: 20, marginBottom: 16 },
  infoText: { fontSize: 13, color: "#8B6F47" },
  favoriteInfo: { color: "#FF4757", fontWeight: "bold" },
  gridContent: { paddingHorizontal: 20, paddingBottom: 20 },
  columnWrapper: { justifyContent: "space-between", marginBottom: 20 },
});
