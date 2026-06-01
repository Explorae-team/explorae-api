# Estágio de Build
FROM node:20-alpine AS build

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Define a URL da API durante o build (necessário para o Expo Web)
ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

# Define as variáveis do Supabase durante o build (necessário para o Expo Web)
ARG EXPO_PUBLIC_SUPABASE_URL
ENV EXPO_PUBLIC_SUPABASE_URL=$EXPO_PUBLIC_SUPABASE_URL

ARG EXPO_PUBLIC_SUPABASE_ANON_KEY
ENV EXPO_PUBLIC_SUPABASE_ANON_KEY=$EXPO_PUBLIC_SUPABASE_ANON_KEY

ARG EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
ENV EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=$EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

# Copia o código e faz o build para web
COPY . .
RUN npx expo export --platform web

# Estágio de Runtime (Nginx)
FROM nginx:alpine

# Copia o build do Expo para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia uma configuração customizada do Nginx para lidar com rotas do SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
