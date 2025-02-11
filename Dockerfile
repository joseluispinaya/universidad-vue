# 1. Usar una imagen oficial de Node.js como base
FROM node:16-alpine

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# 4. Instalar las dependencias
RUN npm install

# 5. Copiar el resto del código fuente
COPY . .

# 6. Exponer el puerto 8080 (por defecto, el servidor de Vue usa este puerto)
EXPOSE 8080

# 7. Comando para iniciar el servidor de desarrollo
CMD ["npm", "run", "serve"]
