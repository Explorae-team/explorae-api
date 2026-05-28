export default {
  expo: {
    name: "Exploraê",
    slug: "explorae-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/branding/app-icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    splash: {
      image: "./assets/branding/logo-main.png",
      resizeMode: "contain",
      backgroundColor: "#00161e"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ],
      config: {
        googleMaps: {
          // AQUI ESTÁ A MÁGICA: Usando a variável do .env
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      },
      predictiveBackGestureEnabled: false,
      package: "com.herbertcarvalho021.exploraenew"
    },
    web: {
      favicon: "./assets/branding/favicon.png",
      bundler: "metro",
      name: "Exploraê",
      shortName: "Exploraê",
      themeColor: "#FF6B35",
      backgroundColor: "#00161e",
      description: "Exploraê - A jornada é o prêmio. Transforme cada passo em uma conquista.",
      display: "standalone",
      orientation: "portrait",
      icons: [
        {
          src: "./assets/branding/app-icon.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-secure-store",
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
};