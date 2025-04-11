FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install
RUN npm install node-cron@3.0.3 --save

# Install wait-for-it script
RUN apk add --no-cache bash
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Copy app source
COPY . .

EXPOSE 3000

# Create a verification script
RUN echo '#!/bin/sh\necho "Verifying node-cron installation:"\nnpm list node-cron\necho "Contents of node_modules:"\nls -la /app/node_modules | grep node-cron\necho "Module paths:"\nnode -e "console.log(module.paths)"\necho "Trying to require node-cron:"\nnode -e "try { require(\"node-cron\"); console.log(\"Success!\"); } catch(e) { console.error(e); }"\necho "Starting the actual application now..."\nexec "$@"' > /usr/local/bin/verify-and-start.sh

RUN chmod +x /usr/local/bin/verify-and-start.sh

# Use wait-for-it script to wait for MySQL before starting the app
CMD ["sh", "-c", "wait-for-it.sh mysql:3306 -t 30 -- verify-and-start.sh npm start"]