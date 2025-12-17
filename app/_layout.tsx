// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorrowHistoryProvider } from '@/app/context/BorrowHistoryContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BorrowHistoryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splash/index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="borrow/[id]" options={{ title: 'Detail Buku' }} />
        </Stack>
      </BorrowHistoryProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
