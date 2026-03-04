FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependência primeiro
COPY package.json package-lock.json* ./

# Instala as dependências dentro do container
RUN npm install

# O comando final que vai manter o container de pé
CMD ["npm", "run", "dev"]
