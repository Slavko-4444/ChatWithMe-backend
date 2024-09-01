# Use the official Node.js image
FROM node:19

# Set the working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the Node.js app
CMD ["npm", "start"]
