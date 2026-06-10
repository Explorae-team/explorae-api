export default {
  expo: {
    name: "Exploraê",
    slug: "explorae-app",
    scheme: "explorae", // <-- Mesclado da main
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
      package: "com.herbertcarvalho021.exploraenew", // <-- Da sua branch
      adaptiveIcon: { // <-- Mesclado da main
        foregroundImage: "./assets/branding/app-icon.png",
        backgroundColor: "#F4F4F9"
      },
      permissions: [ // <-- Da sua branch
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ],
      config: { // <-- Da sua branch
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      },
      predictiveBackGestureEnabled: false
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
        "expo-image-picker",
        {
          photosPermission: "O aplicativo precisa de acesso às suas fotos para alterar sua foto de perfil."
        }
      ],
      [ // <-- Da sua branch
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