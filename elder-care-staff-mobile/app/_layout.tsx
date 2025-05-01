// app/RootLayout.tsx
import React, { useState, useEffect } from "react";
import {StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BookingModal from "@/components/BookingModal";



import useInitService from "@/hooks/useInitService";

export default function RootLayout() {
  useInitService();


  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
          <BookingModal/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
});
