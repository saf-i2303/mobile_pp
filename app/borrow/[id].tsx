import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useBorrowHistory } from "@/app/context/BorrowHistoryContext";

export default function BorrowBookScreen() {
  const { id } = useLocalSearchParams();
  const { addHistory } = useBorrowHistory();

  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowDate, setBorrowDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });
  const [showBorrowPicker, setShowBorrowPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const res = await fetch(`https://books-api-green.vercel.app/books/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (err: unknown) {
        console.log(err instanceof Error ? err.message : err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetail();
  }, [id]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const calculateDays = () => Math.ceil((returnDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));

  const onSubmit = () => {
    if (!book) return;
    if (borrowDate >= returnDate) {
      Alert.alert("Tanggal Tidak Valid", "Tanggal pengembalian harus setelah tanggal peminjaman");
      return;
    }

    Alert.alert(
      "Konfirmasi Peminjaman",
      `Apakah Anda yakin ingin meminjam "${book.title}"?\nDurasi: ${calculateDays()} hari`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, Pinjam",
          onPress: () => {
            // Tambahkan ke context history
            addHistory({
              id: book.id,
              title: book.title,
              author: book.author,
              image: book.image,
              borrowDate,
              returnDate,
            });

            Alert.alert("Berhasil! 🎉", "Peminjaman buku berhasil diajukan.", [
              { text: "OK", onPress: () => router.back() },
            ]);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FDFBF7" }}>
        <ActivityIndicator size="large" color="#8B6F47" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#6B5A4D" }}>Memuat data buku...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FDFBF7", padding: 20 }}>
        <Ionicons name="alert-circle-outline" size={64} color="#DC2626" />
        <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "700", color: "#2B1E16" }}>Buku Tidak Ditemukan</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20, backgroundColor: "#8B6F47", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
        >
          <Text style={{ color: "#FFF", fontWeight: "600" }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FDFBF7" }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Book Info Card */}
        <View style={{ padding: 20, paddingTop: 60, backgroundColor: "#FFF", borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
          <View style={{ flexDirection: "row", backgroundColor: "#F9FAFB", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB" }}>
            <Image source={{ uri: book.image }} style={{ width: 80, height: 120, borderRadius: 12 }} />
            <View style={{ flex: 1, marginLeft: 16, justifyContent: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#2B1E16", marginBottom: 6 }}>{book.title}</Text>
              <Text style={{ fontSize: 13, color: "#6B5A4D" }}>{book.author}</Text>
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View style={{ padding: 20 }}>
          {["Pinjam", "Pengembalian"].map((type) => {
            const isBorrow = type === "Pinjam";
            const date = isBorrow ? borrowDate : returnDate;
            const showPicker = isBorrow ? showBorrowPicker : showReturnPicker;
            const setShowPicker = isBorrow ? setShowBorrowPicker : setShowReturnPicker;

            return (
              <View key={type} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#6B5A4D", marginBottom: 8 }}>
                  Tanggal {type}
                </Text>
                <TouchableOpacity
                  style={{ backgroundColor: "#F9FAFB", borderWidth: 2, borderColor: "#E5E7EB", padding: 16, borderRadius: 12 }}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={{ fontSize: 15, fontWeight: "700", color: "#2B1E16" }}>{formatDate(date)}</Text>
                </TouchableOpacity>
                {showPicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    minimumDate={isBorrow ? new Date() : borrowDate}
                    onChange={(_, d) => {
                      setShowPicker(Platform.OS === "ios");
                      if (!d) return;
                      isBorrow ? setBorrowDate(d) : setReturnDate(d);
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: "#FFF", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
        <TouchableOpacity
          style={{ backgroundColor: "#8B6F47", height: 56, borderRadius: 16, justifyContent: "center", alignItems: "center" }}
          onPress={onSubmit}
        >
          <Text style={{ color: "#FFF", fontSize: 17, fontWeight: "800" }}>Konfirmasi Peminjaman</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
