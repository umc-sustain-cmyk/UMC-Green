FROM node:18-bullseye-slim

# Create app directory
WORKDIR /app

# Copy package manifests first to leverage Docker layer cache
COPY package.json package-lock.json* ./

# Install dependencies (production)
RUN npm ci --only=production

# Copy app source
COPY . .

# Ensure start script is executable
RUN chmod +x ./start.sh || true

# Expose port used by the app
EXPOSE 5000

# Start the application using the start script (it runs migrations then starts)
CMD ["./start.sh"]
