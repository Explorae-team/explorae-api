# Debug Session: Reanimated makeMutable Crash

## Status
- **State**: Investigating
- **Slug**: reanimated-crash
- **Created**: 2026-05-11T08:16:15-03:00

## Symptoms
- `[TypeError: Cannot read property 'makeMutable' of undefined]` in `ExploreHeader.tsx`.
- `[Error: Exception in HostFunction: TurboModule method "installTurboModule" called with 1 arguments (expected argument count: 0).]`
- Occurs when entering the Dashboard after login/onboarding.

## Initial Hypothesis
1. `react-native-reanimated` 4.2.1 is failing to initialize correctly in the Expo Go environment.
2. NativeWind v4's `transition-` and `active:` classes are calling `makeMutable` before Reanimated is ready or because the Babel plugin failed.
3. Version mismatch between Reanimated JS and native TurboModules.

## Investigation Steps
- [X] Check `babel.config.cjs` for `react-native-reanimated/plugin`.
- [ ] Test without `transition-` classes.
- [ ] Check compatibility of Reanimated 4.x with Expo 55.

## Action Taken
- Removed `transition-colors` from `ExploreHeader.tsx`.
