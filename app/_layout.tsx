import { DarkColors, LightColors } from "@/constants/colors";
import { useThemeStore } from "@/store/theme-store";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { activeTheme, hydrate } = useThemeStore();

  useEffect(() => {
    const prepare = async () => {
      await hydrate();
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  const AppTheme = {
    dark: activeTheme === "dark",
    colors:
      activeTheme === "dark"
        ? {
            primary: DarkColors.primary,
            background: DarkColors.background,
            card: DarkColors.card,
            text: DarkColors.text,
            border: DarkColors.border,
            notification: DarkColors.primary,
          }
        : {
            primary: LightColors.primary,
            background: LightColors.background,
            card: LightColors.card,
            text: LightColors.text,
            border: LightColors.border,
            notification: LightColors.primary,
          },
    fonts: {
      regular: { fontFamily: "System", fontWeight: "400" as const },
      medium: { fontFamily: "System", fontWeight: "500" as const },
      bold: { fontFamily: "System", fontWeight: "700" as const },
      heavy: { fontFamily: "System", fontWeight: "900" as const },
    },
  };

  return (
    <ThemeProvider value={AppTheme}>
      <StatusBar style={activeTheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor:
              activeTheme === "dark"
                ? DarkColors.background
                : LightColors.background,
          },
        }}
      >
        <Stack.Screen
          name="splash"
          options={{
            animation: "none",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen
          name="add-transaction"
          options={{
            presentation: "transparentModal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="categories"
          options={{
            presentation: "transparentModal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
