import React, { useState, useMemo } from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.6;

export default function BookCard({ item, isFavorite, onToggleFavorite, onPressCard }) {
  const [isPressed, setIsPressed] = useState(false);
  const rating = useMemo(() => (4.0 + Math.random()).toFixed(1), []);

  return (
    <TouchableOpacity
      style={[styles.bookCard, isPressed && styles.bookCardPressed]}
      onPress={onPressCard}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.95}
    >
      <View style={styles.coverContainer}>
        <Image source={{ uri: item.image }} style={styles.bookCover} />
        <View style={styles.gradientOverlay} />

        {/* Favorite Button */}
        <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
          <View style={styles.favoriteButtonInner}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={16}
              color={isFavorite ? "#FF4757" : "#FFFFFF"}
            />
          </View>
        </TouchableOpacity>

        {/* Title + Author + Rating */}
        <View style={styles.infoOverlay}>
          <View style={styles.bookInfoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.overlayTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.overlayAuthor} numberOfLines={1}>
                {item.author}
              </Text>
            </View>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingBadgeText}>{rating}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  bookCardPressed: {
    elevation: 2,
    transform: [{ scale: 0.96 }],
  },
  coverContainer: {
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  infoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  bookInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingBadgeText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
  },
  overlayTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Nunito_800ExtraBold",
    marginBottom: 3,
    lineHeight: 18,
  },
  overlayAuthor: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Nunito_600SemiBold",
  },
});
