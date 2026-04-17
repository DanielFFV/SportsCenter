# Usa la imagen de Node.js como base
FROM node:lts-alpine

# Establece el directorio de trabajo en la imagen
WORKDIR /app

# Copia los archivos de package.json y package-lock.json para aprovechar el caché de Docker
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install -g @ionic/cli && npm install

# Copia todos los archivos del proyecto al contenedor
COPY . .

# Expone el puerto por donde Ionic sirve la aplicación
EXPOSE 8100

# Comando para iniciar la aplicación
CMD ["ionic", "serve", "--host", "0.0.0.0", "--port", "8100", "--nobrowser"]
