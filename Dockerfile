FROM node:16-alpine as build

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
COPY client ./client

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

RUN npm run build

########### prod ################

FROM node:16-alpine as production

WORKDIR /app

COPY package*.json ./
COPY client ./client

RUN npm install --only=production

COPY --from=build /app/dist ./dist

EXPOSE 3000

# Define the command to run my app using CMD which defines your runtime
CMD ["npm", "run", "start:prod"]


