
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install wait-for-it script
RUN apk add --no-cache bash
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Copy app source
COPY . .

EXPOSE 3000

# Use wait-for-it script to wait for MySQL before starting the app
CMD ["sh", "-c", "wait-for-it.sh mysql:3306 -t 30 -- npm start"]