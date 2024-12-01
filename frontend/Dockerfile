# Etapa 1: Construção
FROM node:18 AS build

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando os arquivos package.json e package-lock.json
COPY package*.json ./

# Instalando as dependências do projeto
RUN npm install

# Copiando o restante dos arquivos do projeto
COPY . .

# Expondo a porta que o Vite vai rodar
EXPOSE 5173

# Comando para rodar o Vite em modo de desenvolvimento, permitindo conexões externas
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
