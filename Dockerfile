FROM node:16-alpine as build

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

RUN --mount=type=secret,id=DB_HOST \
  cat ../run/secrets/DB_HOST
RUN --mount=type=secret,id=DB_PASSWORD \
  cat /run/secrets/DB_PASSWORD
RUN --mount=type=secret,id=DB_DATABASE \
  cat /run/secrets/DB_DATABASE
RUN --mount=type=secret,id=DB_PORT \
  cat /run/secrets/DB_PORT
RUN --mount=type=secret,id=DB_USER \
  cat /run/secrets/DB_USER
RUN --mount=type=secret,id=SECRET_KEY \
  cat /run/secrets/SECRET_KEY

RUN npm run build

########### prod ################

FROM node:16-alpine as production

WORKDIR /app

COPY package*.json ./



RUN npm install --only=production

COPY --from=build /app/dist ./dist

EXPOSE 3000


# Define the command to run my app using CMD which defines your runtime
CMD ["npm", "run", "start:prod"]


