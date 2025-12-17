import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  StyleProp,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Book = {
  id: string;
  title: string;
  author: string;
  image: string;
  isbn?: string;
  category?: string;
  publisher?: string;
  year?: string;
  language?: string;
  condition?: string;
  location?: string;
  stock?: number;
  description?: string;
  createdAt?: string;
};


export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`https://books-api-green.vercel.app/books/${id}`);

      if (!res.ok) throw new Error("Gagal mengambil data");

      const data: Book = await res.json();
      setBook(data);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : "Unknown error";
      console.log("Fetch detail error:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) return <LoadingView />;
  if (!book) return <EmptyView />;

  return (
    <View style={{ flex: 1, backgroundColor: "#FDFBF7" }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <HeroSection image={book.image} />
        <CoverSection image={book.image} />

        <View style={{ paddingHorizontal: 24 }}>
          <TitleSection title={book.title} author={book.author} />
          <DetailSection book={book} />
          <DescriptionSection text={book.description} />
        </View>
      </ScrollView>

      <ActionButtons id={book.id} />
    </View>
  );
}

const LoadingView = () => (
  <View style={styles.centerContainer}>
    <View style={styles.loadingBox}>
      <ActivityIndicator size="large" color="#8B6F47" />
      <Text style={styles.loadingText}>Memuat detail buku...</Text>
    </View>
  </View>
);

const EmptyView = () => (
  <View style={styles.centerContainer}>
    <Ionicons name="book-outline" size={64} color="#D4C4B0" />
    <Text style={styles.notFoundTitle}>Buku Tidak Ditemukan</Text>

    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Text style={styles.backButtonText}>Kembali</Text>
    </TouchableOpacity>
  </View>
);


const HeroSection = ({ image }: { image: string }) => (
  <View style={{ position: "relative", height: 200 }}>
    <Image
      source={{ uri: image }}
      style={{ width: "100%", height: "100%", position: "absolute" }}
      blurRadius={30}
    />

    <LinearGradient
      colors={["rgba(0,0,0,0.25)", "rgba(253,251,247,0.95)"]}
      style={{ position: "absolute", width: "100%", height: "100%" }}
    />

    <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={24} color="#2B1E16" />
    </TouchableOpacity>
  </View>
);

const CoverSection = ({ image }: { image: string }) => (
  <View style={{ alignItems: "center", marginTop: -100, marginBottom: 20 }}>
    <Image source={{ uri: image }} style={styles.coverImage} resizeMode="cover" />
  </View>
);

const TitleSection = ({
  title,
  author,
}: {
  title: string;
  author: string;
}) => (
  <>
    <Text style={styles.title}>{title}</Text>

    <View style={styles.authorRow}>
      <Ionicons name="person-outline" size={18} color="#8B6F47" />
      <Text style={styles.author}>{author}</Text>
    </View>
  </>
);

const DetailSection = ({ book }: { book: Book }) => (
  <View style={styles.card}>
    <SectionHeader icon="information-circle" title="Informasi Buku" />

    <View style={{ gap: 14 }}>
      {renderField("ISBN", book.isbn)}
      {renderField("Kategori", book.category)}
      {renderField("Penerbit", book.publisher)}
      {renderField("Tahun Terbit", book.year)}
      {renderField("Bahasa", book.language)}
      {renderStatus(book.condition)}
      {renderLocation(book.location)}
      {renderStock(book.stock)}
      {renderDate("Ditambahkan", book.createdAt)}
    </View>
  </View>
);


const DescriptionSection = ({ text }: { text?: string }) => (
  <View style={styles.card}>
    <SectionHeader icon="document-text" title="Deskripsi" />
    <Text style={styles.description}>
      {text || "Deskripsi belum tersedia untuk buku ini."}
    </Text>
  </View>
);


const ActionButtons = ({ id }: { id: string }) => (
  <View style={styles.footerBox}>
    <View style={{ flexDirection: "row", gap: 12 }}>
      <TouchableOpacity style={styles.favoriteBtn}>
        <Ionicons name="heart-outline" size={26} color="#EF4444" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.borrowBtn}
        onPress={() => router.push(`/borrow/${id}`)}
      >
        <Ionicons name="bookmark" size={22} color="#FFF" />
        <Text style={styles.borrowText}>Pinjam Sekarang</Text>
      </TouchableOpacity>
    </View>
  </View>
);


const renderField = (label: string, value?: string) =>
  value ? (
    <Row>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Row>
  ) : null;

const renderDate = (label: string, value?: string) =>
  value ? (
    <Row>
      <Label>{label}</Label>
      <Value>
        {new Date(value).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Value>
    </Row>
  ) : null;

const renderLocation = (value?: string) =>
  value ? (
    <Row>
      <Label>Lokasi</Label>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="location" size={16} color="#8B6F47" />
        <Value style={{ marginLeft: 4 }}>{value}</Value>
      </View>
    </Row>
  ) : null;

const renderStock = (value?: number) =>
  value !== undefined ? (
    <Row>
      <Label>Stok</Label>
      <StatusBox bg={value > 0 ? "#DCFCE7" : "#FEE2E2"}>
        <Text
          style={{
            color: value > 0 ? "#16A34A" : "#DC2626",
            fontWeight: "700",
          }}
        >
          {value}
        </Text>
      </StatusBox>
    </Row>
  ) : null;

const renderStatus = (value?: string) =>
  value ? (
    <Row>
      <Label>Kondisi Buku</Label>
      <StatusBox
        bg={
          value.toLowerCase() === "baik"
            ? "#DCFCE7"
            : value.toLowerCase() === "rusak"
            ? "#FEE2E2"
            : "#FEF3C7"
        }
      >
        <Text style={{ fontWeight: "700" }}>{value}</Text>
      </StatusBox>
    </Row>
  ) : null;


const Row = ({ children }: { children: React.ReactNode }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    {children}
  </View>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: 14, color: "#6B5A4D", fontWeight: "600" }}>
    {children}
  </Text>
);

const Value = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) => (
  <Text
    style={[
      { fontSize: 14, color: "#2B1E16", fontWeight: "700" },
      style,
    ]}
  >
    {children}
  </Text>
);

const StatusBox = ({
  children,
  bg,
}: {
  children: React.ReactNode;
  bg: string;
}) => (
  <View
    style={{
      backgroundColor: bg,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 8,
    }}
  >
    {children}
  </View>
);

const SectionHeader = ({
  icon,
  title,
}: {
  icon: any;
  title: string;
}) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
    <Ionicons name={icon} size={22} color="#8B6F47" />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// ==========================
// Styles
// ==========================
const styles = {
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDFBF7",
    padding: 20,
  },
  loadingBox: {
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#6B5A4D",
  },
  notFoundTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#4A3F35",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#8B6F47",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  backIcon: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  coverImage: {
    width: 180,
    height: 270,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    color: "#2B1E16",
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  author: {
    fontSize: 16,
    marginLeft: 6,
    color: "#8B6F47",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 8,
    color: "#2B1E16",
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4A3F35",
    textAlign: "justify",
  },
  footerBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
  },
  favoriteBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E8E2D9",
    backgroundColor: "#FFF",
  },
  borrowBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#8B6F47",
  },
  borrowText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 8,
  },
};
