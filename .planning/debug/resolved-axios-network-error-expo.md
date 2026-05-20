# Debug Session: Axios Network Error in Expo

## Status
- **State**: Resolved
- **Slug**: axios-network-error-expo
- **Created**: 2026-05-11T08:10:35-03:00

## Symptoms
- `[AxiosError: Network Error]` observed in Expo terminal logs during login and registration. (RESOLVED)
- App crashes upon redirecting to `/dashboard` after preference selection.
- Error: `[TypeError: Cannot read property 'makeMutable' of undefined]` in `ExploreHeader.tsx`.
- Error: `[Error: Exception in HostFunction: TurboModule method "installTurboModule" called with 1 arguments (expected argument count: 0).]`

## Initial Hypothesis
1. [CONFIRMED] The frontend was attempting to connect to `localhost:8080`, which refers to the mobile device itself.
2. [ACTIVE] `react-native-reanimated` 4.2.1 is incompatible with the current Expo Go version or its Babel plugin is not working, causing a crash when NativeWind v4 attempts to use it for transitions.
3. The `transition-` classes in NativeWind v4 are triggering Reanimated's `makeMutable`, which fails because Reanimated is not correctly initialized.

## Investigation Steps
- [X] Check frontend API configuration (Base URL).
- [X] Check backend binding and server port.
- [X] Verify host machine IP address (from Metro logs: `192.168.0.37`).
- [ ] Test connectivity from the host to the backend.

## Action Taken
- Created `frontend/.env` with `EXPO_PUBLIC_API_URL=http://192.168.0.37:8080`.
- Verified `frontend/src/services/api.js` uses `process.env.EXPO_PUBLIC_API_URL`.

## Root Cause
The Axios `baseURL` was defaulting to `http://localhost:8080`. When running the app on a mobile device or emulator via Expo Go, `localhost` refers to the device itself, not the host machine where the backend is running. This resulted in a "Network Error".

## Resolution
Created a `.env` file in the `frontend` directory with `EXPO_PUBLIC_API_URL=http://192.168.0.37:8080` (the host machine's IP address). This allows the mobile device to reach the backend over the local network.

> [!TIP]
> After creating the `.env` file, you may need to restart the Expo server with `npx expo start -c` to clear the cache and ensure the new environment variables are loaded.
