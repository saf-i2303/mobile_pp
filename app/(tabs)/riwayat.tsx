import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, StatusBar } from "react-native";
import { useBorrowHistory } from "@/app/context/BorrowHistoryContext";
import { Ionicons } from "@expo/vector-icons";

export default function RiwayatScreen() {
  const { history } = useBorrowHistory();

  if (!history || history.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="calendar-outline" size={64} color="#D4C4B0" />
          </View>
          <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
          <Text style={styles.emptySubtitle}>
            Riwayat peminjaman buku Anda akan muncul di sini
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Peminjaman</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{history.length} Buku</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {history.map((item, index) => {
          const borrowDate = item.borrowDate instanceof Date ? item.borrowDate : new Date(item.borrowDate);
          const returnDate = item.returnDate instanceof Date ? item.returnDate : new Date(item.returnDate);
          
          // Calculate duration
          const duration = Math.ceil((returnDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Check if overdue
          const today = new Date();
          const isOverdue = today > returnDate;
          const isActive = today >= borrowDate && today <= returnDate;

          return (
            <View key={item.id || index} style={styles.card}>
              {/* Status Badge */}
              <View style={[
                styles.statusBadge,
                isOverdue ? styles.statusOverdue : isActive ? styles.statusActive : styles.statusCompleted
              ]}>
                <Ionicons 
                  name={isOverdue ? "alert-circle" : isActive ? "time" : "checkmark-circle"} 
                  size={12} 
                  color="#FFF" 
                />
                <Text style={styles.statusText}>
                  {isOverdue ? "Terlambat" : isActive ? "Aktif" : "Selesai"}
                </Text>
              </View>

              <View style={styles.cardInner}>
                {/* Book Cover */}
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>

                {/* Book Info */}
                <View style={styles.cardContent}>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>
                  
                  <View style={styles.authorContainer}>
                    <Ionicons name="person-outline" size={14} color="#8B6F47" />
                    <Text style={styles.author} numberOfLines={1}>
                      {item.author}
                    </Text>
                  </View>

                  {/* Date Info */}
                  <View style={styles.dateContainer}>
                    <View style={styles.singleDateRow}>
                      <Ionicons name="calendar" size={13} color="#8B6F47" />
                      <Text style={styles.dateText}>
                        {borrowDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - {returnDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </Text>
                    </View>
                  </View>

                  {/* Duration Badge */}
                  <View style={styles.durationBadge}>
                    <Ionicons name="time-outline" size={12} color="#8B6F47" />
                    <Text style={styles.durationText}>{duration} Hari</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2B1E16",
  },
  headerBadge: {
    backgroundColor: "#EFE7DB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8B6F47",
  },
  scrollContainer: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2B1E16",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B5A4D",
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FDFBF7",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    alignSelf: "flex-start",
    margin: 12,
    marginBottom: 0,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: "#059669",
  },
  statusOverdue: {
    backgroundColor: "#DC2626",
  },
  statusCompleted: {
    backgroundColor: "#8B6F47",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
  },
  cardInner: {
    flexDirection: "row",
    padding: 12,
  },
  imageContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: 70,
    height: 105,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFF",
    backgroundColor: "#F3F4F6",
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2B1E16",
    lineHeight: 20,
    marginBottom: 4,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  author: {
    fontSize: 13,
    color: "#6B5A4D",
    fontWeight: "600",
    flex: 1,
  },
  dateContainer: {
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  singleDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: "#2B1E16",
    fontWeight: "600",
    flex: 1,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#92400E",
  },
});