FROM node:20-alpine
WORKDIR /app

# Install deps first for better caching
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]