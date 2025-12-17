import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

export default function Splash() {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  const handleAnimationFinish = () => {
    router.replace("/welcome");
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../../assets/lottie/splash.json")}
        loop={false}
        onAnimationFinish={handleAnimationFinish}
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  lottie: {
    width: 240,
    height: 240,
  },
});
