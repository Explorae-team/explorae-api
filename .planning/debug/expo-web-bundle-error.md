# Debug Session: Expo Web Bundle Error (500 Internal Server Error)

## Symptoms
- `Failed to load resource: the server responded with a status of 500 (Internal Server Error)` on `entry.bundle`.
- `Refused to execute script... MIME type ('application/json') is not executable`.
- Occurs on the Web platform after `npm install`.

## Hypotheses
1. **Dependency Mismatch**: `expo-image-picker` or other newly added dependencies are not compatible with the web platform version or missing peer dependencies.
2. **Babel Configuration**: The `.babelrc` or `babel.config.js` is missing or incorrect for Expo Web.
3. **Metro Cache**: Stale cache causing transformation failures.
4. **Missing Web Dependencies**: `react-native-web`, `react-dom`, or `@expo/metro-runtime` might be missing or out of sync.

## Investigation Log
- [ ] Check `package.json` for all required web dependencies.
- [ ] Inspect Metro bundler logs (if possible) or run `npx expo start --web` to see terminal errors.
- [ ] Check `babel.config.js`.
- [ ] Try clearing Metro cache.

## Root Cause
1. **Arquivos Inexistentes**: O arquivo `src/app/dashboard/edit-profile.tsx` tentava importar `ProfilePhotoEdit` e `ProfileForm` que ainda não haviam sido criados no diretório `src/components/`.
2. **Importação Comentada**: O `expo-image-picker` estava comentado no `UserStats.tsx`, o que impedia o teste da funcionalidade de upload.

## Resolution
1. **Criação de Componentes**: Criados os arquivos `src/components/ProfilePhotoEdit.tsx` e `src/components/ProfileForm.tsx` com implementações baseadas no padrão visual do projeto.
2. **Ativação do ImagePicker**: Descomentada a importação e a lógica de `pickImage` no `UserStats.tsx`.
3. **Sincronização de Dependências**: Verificado via `npm install` que as dependências estão presentes no `node_modules`.

**Status**: Resolvido. Recomenda-se reiniciar o servidor Expo com `npx expo start -c --web` para limpar o cache do Metro.
