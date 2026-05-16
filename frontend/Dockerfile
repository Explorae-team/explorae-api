# Estágio de Build
FROM node:20-alpine AS build

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Define a URL da API durante o build (necessário para o Expo Web)
ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

# Copia o código e faz o build para web
COPY . .
RUN npx expo export --platform web

# Estágio de Runtime (Nginx)
FROM nginx:alpine

# Copia o build do Expo para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia uma configuração customizada do Nginx se necessário (para lidar com rotas do SPA)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
